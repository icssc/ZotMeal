import type {
  PrismaClientWithAccelerate,
  TransactionClientWithAccelerate,
} from "@zotmeal/db";

import type { DishParams } from "../models";

export async function saveDish(
  db: PrismaClientWithAccelerate | TransactionClientWithAccelerate,
  params: DishParams,
) {
  const { id, stationId, name, description, dietRestriction, nutritionInfo } =
    params;

  await db.dish.upsert({
    where: {
      id,
    },
    create: {
      id,
      name,
      description,
      dietRestriction: {
        connectOrCreate: {
          where: { dishId: id },
          create: dietRestriction,
        },
      },
      nutritionInfo: {
        connectOrCreate: {
          where: { dishId: id },
          create: nutritionInfo,
        },
      },
      stationId,
    },
    update: {
      id,
      name,
      description,
      dietRestriction: {
        connectOrCreate: {
          where: { dishId: id },
          create: dietRestriction,
        },
      },
      nutritionInfo: {
        connectOrCreate: {
          where: { dishId: id },
          create: nutritionInfo,
        },
      },
      stationId,
    },
  });
}
