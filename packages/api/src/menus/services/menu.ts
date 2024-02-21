import { TRPCError } from "@trpc/server";

import type { Prisma, PrismaClient } from "@zotmeal/db";
import { parseDate } from "@zotmeal/utils";

import type { GetMenuParams, MenuParams } from "../models/menu";

export async function getMenu(
  db: PrismaClient | Prisma.TransactionClient,
  params: GetMenuParams,
) {
  const {
    date: dateString,
    period: periodName,
    restaurant: restaurantName,
  } = params;

  const date = parseDate(dateString);
  if (date === null) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "invalid date format",
    });
  }

  const restaurant = await db.restaurant.findFirst({
    where: {
      name: restaurantName,
    },
    include: {
      stations: false,
      menu: false,
    },
  });

  if (restaurant === null) {
    throw new TRPCError({ message: "restaurant not found", code: "NOT_FOUND" });
  }

  const period = await db.menuPeriod.findUnique({
    where: { name: periodName },
  });
  if (period === null) {
    throw new TRPCError({ message: "period not found", code: "NOT_FOUND" });
  }

  const menu = db.menu.findFirst({
    where: {
      restaurantId: restaurant.id,
      date,
      periodId: period.id,
    },
    include: {
      period: true,
      stations: {
        include: {
          dishes: {
            include: {
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

  return await db.menu.upsert({
    where: { id },
    create: upsertParams,
    update: upsertParams,
  });
}
