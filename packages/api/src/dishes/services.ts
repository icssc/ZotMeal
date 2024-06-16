import { upsert } from "@api/utils";

import type { DishToMenu, DishWithRelations, Drizzle } from "@zotmeal/db";
import {
  dietRestrictions,
  dishes,
  dishesToMenus,
  nutritionInfos,
} from "@zotmeal/db";

export async function upsertDish(
  db: Drizzle,
  { dietRestriction, nutritionInfo, ...dishData }: DishWithRelations,
): Promise<Omit<DishWithRelations, "menuId" | "stationId">> {
  try {
    const upsertedDish = await upsert(db, dishes, dishData, {
      target: [dishes.id],
      set: dishData,
    });

    const upsertedDietRestriction = await upsert(
      db,
      dietRestrictions,
      dietRestriction,
      {
        target: dietRestrictions.dishId,
        set: dietRestriction,
      },
    );

    const upsertedNutritionInfo = await upsert(
      db,
      nutritionInfos,
      nutritionInfo,
      {
        target: nutritionInfos.dishId,
        set: nutritionInfo,
      },
    );

    return {
      ...upsertedDish,
      dietRestriction: upsertedDietRestriction,
      nutritionInfo: upsertedNutritionInfo,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const upsertDishToMenu = async (db: Drizzle, dishToMenu: DishToMenu) =>
  await upsert(db, dishesToMenus, dishToMenu, {
    target: [dishesToMenus.dishId, dishesToMenus.menuId],
    set: dishToMenu,
  });
