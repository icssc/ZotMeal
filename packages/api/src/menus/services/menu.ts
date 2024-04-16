import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Drizzle } from "@zotmeal/db";
import type {
  Dish,
  Menu,
  MenuWithRelations,
  Station,
} from "@zotmeal/db/src/schema";
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

export async function getMenu(db: Drizzle, params: GetMenuParams) {
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

  // const menu = await db.query.MenuTable.findFirst({
  //   where: (menu, { eq }) => eq(menu.restaurantId, fetchedRestaurant.id),
  //   with: {
  //     stations: {
  //       with: {
  //         dishes: {
  //           with: {
  //             dietRestriction: true,
  //             nutritionInfo: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  const rows = await db
    .select()
    .from(DishMenuStationJoint)
    .innerJoin(MenuTable, eq(DishMenuStationJoint.menuId, MenuTable.id))
    .innerJoin(DishTable, eq(DishMenuStationJoint.dishId, DishTable.id))
    .innerJoin(
      StationTable,
      eq(DishMenuStationJoint.stationId, StationTable.id),
    );
  interface StationResult extends Station {
    dishes: Dish[];
  }

  interface MenuResult extends Menu {
    stations: StationResult[];
  }

  const menu = {
    stations: [],
  };
  // for (const row of rows) {
  //   const { dishes, menu, stations } = row;
  //   console.log(dishes, menu, stations);

  //   // menu.stations.push()
  // }

  console.log("NUMBER OF ROWS", rows.length);

  // need to group by server side
  // unfortunate it is slow compared to a GROUP_JOIN

  // return menu;
  return null;
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
