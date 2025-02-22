import { upsert } from "@api/utils";

import type { Drizzle, InsertMenu } from "@zotmeal/db";
import { menus } from "@zotmeal/db";

// export async function getMenu(
//   db: Drizzle,
//   date: Date,
//   periodId: string,
//   restaurantName: RestaurantName,
// ): Promise<MenuWithRelations> {
//   const fetchedRestaurant = await db.query.restaurants.findFirst({
//     where: (restaurant, { eq }) => eq(restaurant.name, restaurantName),
//   });

//   if (!fetchedRestaurant)
//     throw new TRPCError({
//       message: `restaurant ${restaurantName} not found`,
//       code: "NOT_FOUND",
//     });

//   const fetchedMenu = await db.query.menus.findFirst({
//     where: (menu, { eq, and }) =>
//       and(
//         eq(menu.date, format(date, "yyyy-MM-dd")),
//         eq(menu.periodId, periodId),
//         eq(menu.restaurantId, fetchedRestaurant.id),
//       ),
//   });

//   if (!fetchedMenu)
//     throw new TRPCError({
//       message: `menu (${restaurantName}, ${periodId}, ${date.toLocaleDateString()}) not found`,
//       code: "NOT_FOUND",
//     });

//   // Compile stations and dishes for the menu
//   const rows = await db.query.dishMenuStationJoins.findMany({
//     where: ({ menuId }, { eq }) => eq(menuId, fetchedMenu.id),
//     with: {
//       dish: {
//         with: {
//           dietRestriction: true,
//           nutritionInfo: true,
//         },
//       },
//       menu: true,
//       station: true,
//     },
//   });

//   let menuResult: MenuWithRelations | null = null;
//   const stationsResult: Record<string, StationWithRelations> = {};

//   for (const row of rows) {
//     menuResult ??= {
//       ...row.menu,
//       stations: [],
//     };

//     const { dish, station, menuId, stationId } = row;

//     stationsResult[station.id] ??= {
//       ...station,
//       dishes: [],
//     };

//     stationsResult[station.id]?.dishes.push({ ...dish, menuId, stationId });
//   }

//   if (!menuResult)
//     throw new TRPCError({
//       message: "error querying join table",
//       code: "NOT_FOUND",
//     });

//   for (const stationId in stationsResult)
//     menuResult.stations.push(stationsResult[stationId]!);

//   return menuResult;
// }

export const upsertMenu = async (db: Drizzle, menu: InsertMenu) =>
  await upsert(db, menus, menu, {
    target: menus.id,
    set: menu,
  });
