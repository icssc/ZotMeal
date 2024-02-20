import type { Prisma, PrismaClient, Restaurant } from "@zotmeal/db";

import type { RestaurantParams } from "../models";

export function updateRestaurant(
  db: PrismaClient,
  // params: UpdateRestaurantParams
) {
  // validate with zod
  const _ = db.restaurant.findFirst();
}

export function createRestaurant(db: PrismaClient, params: RestaurantParams) {
  // validate with zod

  const { id, name } = params;

  const _ = db.restaurant.findFirst({
    where: {
      id,
      name,
    },
  });
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
