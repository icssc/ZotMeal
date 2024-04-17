import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Drizzle } from "@zotmeal/db";
import type { Dish, Menu, Station } from "@zotmeal/db/src/schema";
import { eq } from "@zotmeal/db";
import {
  DishMenuStationJoint,
  DishTable,
  MenuTable,
  StationTable,
} from "@zotmeal/db/src/schema";
import { parseDate } from "@zotmeal/utils";
import { DateRegex } from "@zotmeal/validators";

export interface GetMenuParams {
  date: string;
  periodName: string;
  restaurantName: string;
}

export const GetMenuSchema = z.object({
  date: DateRegex,
  periodName: z.string(),
  restaurantName: z.string(),
}) satisfies z.ZodType<GetMenuParams>;

// deliberate choice to exclude nutrition on dish model, the list view will not contain the full dish nutrition details
interface StationResult extends Station {
  dishes: Dish[];
}

interface MenuResult extends Menu {
  stations: StationResult[];
}

export async function getMenu(
  db: Drizzle,
  params: GetMenuParams,
): Promise<MenuResult | null> {
  const date = parseDate(params.date);
  if (!date) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "invalid date format",
    });
  }

  const fetchedRestaurant = await db.query.RestaurantTable.findFirst({
    where: (restaurant, { eq }) => eq(restaurant.name, params.restaurantName),
  });

  if (!fetchedRestaurant) {
    throw new TRPCError({ message: "restaurant not found", code: "NOT_FOUND" });
  }

  const rows = await db
    .select()
    .from(DishMenuStationJoint)
    .innerJoin(MenuTable, eq(DishMenuStationJoint.menuId, MenuTable.id))
    .innerJoin(DishTable, eq(DishMenuStationJoint.dishId, DishTable.id))
    .innerJoin(
      StationTable,
      eq(DishMenuStationJoint.stationId, StationTable.id),
    );

  // const rowsRelation = await db.query.DishMenuStationJoint.findMany({
  //   with: {
  //     dish: true,
  //     menu: true,
  //     station: true,
  //   },
  // });

  let menuResult: MenuResult | null = null;
  const stationsResult: Record<string, StationResult> = {};

  for (const row of rows) {
    if (!menuResult) {
      menuResult = {
        ...row.menu,
        stations: [],
      };
    }
    const { dishes: dish, menu, stations: station } = row;
    if (!(station.id in stationsResult)) {
      stationsResult[station.id] = {
        ...station,
        dishes: [],
      };
    }
    stationsResult[station.id]?.dishes.push(dish);
    console.log(dish, menu, station);
  }
  if (!menuResult) {
    return null;
  }

  for (const stationId in stationsResult) {
    menuResult.stations.push(stationsResult[stationId]!);
  }

  console.log("NUMBER OF ROWS", rows.length);
  return menuResult;
}

export async function upsertMenu(db: Drizzle, params: Menu): Promise<Menu> {
  const date = parseDate(params.date);
  if (!date) {
    throw Error("invalid date");
  }

  const { id, restaurantId } = params;

  const menuResult: Menu[] = await db
    .insert(MenuTable)
    .values({
      id,
      restaurantId,
      date: date.toISOString(),
      period: params.period, // Add the missing 'period' property
      start: params.start, // Add the missing 'start' property
      end: params.end, // Add the missing 'end' property
      price: params.price,
    })
    .onConflictDoUpdate({
      target: MenuTable.id,
      set: params,
    })
    .returning();

  if (menuResult.length !== 1) {
    throw new Error(
      `expected 1 menu to be upserted, but got ${menuResult.length}`,
    );
  }

  return menuResult[0]!;
}
