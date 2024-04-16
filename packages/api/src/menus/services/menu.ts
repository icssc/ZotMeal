import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Drizzle } from "@zotmeal/db";
import type { Menu, MenuWithRelations } from "@zotmeal/db/src/schema";
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
): Promise<MenuWithRelations | undefined> {
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

  const menu = await db.query.MenuTable.findFirst({
    where: (menu, { eq }) => eq(menu.restaurantId, fetchedRestaurant.id),
    with: {
      stations: {
        with: {
          dishes: {
            with: {
              dietRestriction: true,
              nutritionInfo: true,
            },
          },
        },
      },
    },
  });

  return menu;
}

export async function upsertMenu(
  db: Drizzle,
  params: Menu,
): Promise<Menu | undefined> {
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

  return menuResult[0];
}
