import type { Prisma, PrismaClient } from "@zotmeal/db";
import { parseDate } from "@zotmeal/utils";

import type { MenuParams } from "../models/menu";

// export async function getMenu(
//   db: PrismaClient | Prisma.TransactionClient,
//   params: GetMenuParams,
// ) {
//   const { date: dateString, period, restaurant: restaurantName } = params;
//   const date = parseDate(params.date);

//   const restaurant = await db.restaurant.findFirst({
//     where: {
//       name: restaurantName,
//     },
//     include: {
//       stations: false,
//       menu: false,
//     },
//   });

//   const menu = db.menu.findUnique({
//     where: {
//       date,
//     },
//   });
// }

export async function saveMenu(
  db: PrismaClient | Prisma.TransactionClient,
  params: MenuParams,
) {
  const date = parseDate(params.date);
  if (!date) {
    throw Error("invalid date");
  }

  const { id, periodId, restaurant, stations } = params;

  const upsertParams = {
    id,
    periodId,
    restaurantId: restaurant.id,
    date,
    stations: {
      connect: stations.map((station) => {
        return { id: station.id };
      }),
    },
  };

  await db.menu.upsert({
    where: { id },
    create: upsertParams,
    update: upsertParams,
  });
}
