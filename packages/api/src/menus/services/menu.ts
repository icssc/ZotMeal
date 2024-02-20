import type { Prisma, PrismaClient } from "@zotmeal/db";
import { parseDate } from "@zotmeal/utils";

import type { MenuParams } from "../models/menu";

export async function createMenu(
  db: PrismaClient | Prisma.TransactionClient,
  params: MenuParams,
) {
  const date = parseDate(params.date);
  if (!date) {
    throw Error("invalid date");
  }

  const { id, period, start, end, restaurant, stations } = params;

  await db.menu.create({
    data: {
      id,
      period,
      start,
      restaurantId: restaurant.id,
      date,
      end,
      stations: {
        connect: stations.map((station) => {
          return { id: station.id };
        }),
      },
    },
  });
}
