import type { PrismaClient } from "@zotmeal/db";

import type { DishParams } from "../models";

export async function createDish(db: PrismaClient, dish: DishParams) {
  const { id, description, dietRestriction, nutritionInfo, name } = dish;

  await db.dish.create({
    data: {
      id,
      name,
      description,
      dietRestriction: {
        create: dietRestriction,
      },
      nutritionInfo: {
        create: nutritionInfo,
      },
      stationId: dish.stationId,
    },
  });
}

export async function updateDish(db: PrismaClient, dish: DishParams) {
  const { id, description, name, dietRestriction, nutritionInfo } = dish;
  await db.dish.update({
    where: { id },
    data: {
      description,
      name,
      dietRestriction: {
        update: dietRestriction,
      },
      nutritionInfo: {
        update: nutritionInfo,
      },
    },
  });
}
