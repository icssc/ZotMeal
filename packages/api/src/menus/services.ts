import { TRPCError } from "@trpc/server";
import { format } from "date-fns";

import type {
  Drizzle,
  Menu,
  MenuWithRelations,
  StationWithRelations,
} from "@zotmeal/db";
import { MenuTable } from "@zotmeal/db";
import { PeriodName, RestaurantName } from "@zotmeal/utils";

export async function getMenu(
  db: Drizzle,
  date: Date,
  period: PeriodName,
  restaurantName: RestaurantName,
): Promise<MenuWithRelations> {
  const fetchedRestaurant = await db.query.RestaurantTable.findFirst({
    where: (restaurant, { eq }) => eq(restaurant.name, restaurantName),
  });

  if (!fetchedRestaurant)
    throw new TRPCError({
      message: `restaurant ${restaurantName} not found`,
      code: "NOT_FOUND",
    });

  const fetchedMenu = await db.query.MenuTable.findFirst({
    where: (menu, { eq, and }) =>
      and(
        eq(menu.date, format(date, "yyyy-MM-dd")),
        eq(menu.period, period),
        eq(menu.restaurantId, fetchedRestaurant.id),
      ),
  });

  if (!fetchedMenu)
    throw new TRPCError({
      message: `menu (${restaurantName}, ${period}, ${date.toLocaleDateString()}) not found`,
      code: "NOT_FOUND",
    });

  // Compile stations and dishes for the menu
  const rows = await db.query.DishMenuStationJointTable.findMany({
    where: ({ menuId }, { eq }) => eq(menuId, fetchedMenu.id),
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
    if (!menuResult)
      menuResult = {
        ...row.menu,
        stations: [],
      };

    const { dish, station, menuId, stationId } = row;

    if (!(station.id in stationsResult))
      stationsResult[station.id] = {
        ...station,
        dishes: [],
      };

    stationsResult[station.id]?.dishes.push({ ...dish, menuId, stationId });
  }

  if (!menuResult)
    throw new TRPCError({
      message: "error querying join table",
      code: "NOT_FOUND",
    });

  for (const stationId in stationsResult)
    menuResult.stations.push(stationsResult[stationId]!);

  return menuResult;
}

export async function upsertMenu(db: Drizzle, params: Menu): Promise<Menu> {
  const { id, restaurantId, date } = params;

  const upsertResult: Menu[] = await db
    .insert(MenuTable)
    .values({
      id,
      restaurantId,
      date,
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

  const upsertedMenu = upsertResult[0];

  if (!upsertedMenu || upsertResult.length !== 1)
    throw new Error(
      `expected 1 menu to be upserted, but got ${upsertResult.length}`,
    );

  return upsertedMenu;
}
