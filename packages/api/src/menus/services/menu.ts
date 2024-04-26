import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Drizzle } from "@zotmeal/db";
import type {
  Menu,
  MenuWithRelations,
  StationWithRelations,
} from "@zotmeal/db/src/schema";
import { MenuTable } from "@zotmeal/db/src/schema";
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

export async function getMenu(
  db: Drizzle,
  params: GetMenuParams,
): Promise<MenuWithRelations | null> {
  console.log("GET MENU params:", params);
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

  const rows = await db.query.DishMenuStationJoint.findMany({
    with: {
      dish: {
        with: {
          dietRestriction: true,
          nutritionInfo: true,
        },
      },
      menu: true,
      station: true,
    },
  });

  let menuResult: MenuWithRelations | null = null;
  const stationsResult: Record<string, StationWithRelations> = {};

  for (const row of rows) {
    if (!menuResult) {
      menuResult = {
        ...row.menu,
        stations: [],
      };
    }
    const { dish, menu, station, menuId, stationId } = row;
    if (!(station.id in stationsResult)) {
      stationsResult[station.id] = {
        ...station,
        dishes: [],
      };
    }
    stationsResult[station.id]?.dishes.push({ ...dish, menuId, stationId });
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
