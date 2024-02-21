import type { Prisma, PrismaClient, Restaurant } from "@zotmeal/db";

import type { RestaurantParams } from "../models";

export async function saveRestaurant(
  db: PrismaClient | Prisma.TransactionClient,
  params: RestaurantParams,
) {
  const { id, name } = params;

  const restaurant = await db.restaurant.upsert({
    where: { id },
    create: {
      id,
      name,
    },
    update: {
      id,
      name,
    },
  });
  return restaurant;
}

export async function getRestaurantById(
  db: PrismaClient | Prisma.TransactionClient,
  id: string,
): Promise<Restaurant | null> {
  return await db.restaurant.findUnique({
    where: {
      id,
    },
  });
}
