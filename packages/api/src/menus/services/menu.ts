import { TRPCError } from "@trpc/server";
import type { Drizzle } from "@zotmeal/db";
import type { Menu, MenuPeriod, MenuWithRelations, Restaurant } from "@zotmeal/db/src/schema";
import { MenuPeriodSchema, RestaurantSchema, menu } from "@zotmeal/db/src/schema";
import { parseDate } from "@zotmeal/utils";
import { DateRegex } from "@zotmeal/validators";
import { z } from "zod";

export interface GetMenuParams {
  date: string;
  periodName: MenuPeriod["name"];
  restaurantName: Restaurant["name"];
}

export const GetMenuSchema = z.object({
  date: DateRegex,
  periodName: MenuPeriodSchema.shape.name,
  restaurantName: RestaurantSchema.shape.name,
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

  const fetchedRestaurant = await db.query.restaurant.findFirst({
    where: (restaurant, { eq }) => eq(restaurant.name, params.restaurantName),
  });

  if (!fetchedRestaurant) {
    throw new TRPCError({ message: "restaurant not found", code: "NOT_FOUND" });
  }

  const menuPeriod = await db.query.menuPeriod.findFirst({
    where: (menuPeriod, { eq }) => eq(menuPeriod.name, params.periodName),
  });

  if (!menuPeriod) {
    throw new TRPCError({ message: "period not found", code: "NOT_FOUND" });
  }

  const menu = await db.query.menu.findFirst({
    where: (menu, { eq }) => eq(menu.restaurantId, fetchedRestaurant.id),
    with: {
      menuPeriod: true,
      stations: {
        with: {
          dishes: {
            with: {
              dietRestriction: true,
              nutritionInfo: true,
            },
          }
        },
      }
    }
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

  const { id, periodId, restaurantId } = params;

  const upsertedMenu: Menu[] = await db
    .insert(menu)
    .values({
      id,
      periodId,
      restaurantId,
      date: date.toISOString(),
    })
    .onConflictDoUpdate({
      target: menu.id,
      set: params,
    })
    .returning();

  if (upsertedMenu.length !== 1) {
    throw new Error(`expected 1 menu to be upserted, but got ${upsertedMenu.length}`);
  }

  return upsertedMenu[0];
}