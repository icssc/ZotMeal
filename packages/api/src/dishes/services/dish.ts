import { dish, dietRestriction, nutritionInfo } from "@zotmeal/drizzle-db/src/schema";
import type { DishWithRelations } from "@zotmeal/drizzle-db/src/schema";
import type { Drizzle } from "@zotmeal/drizzle-db";

export async function upsertDish(
  db: Drizzle,
  params: DishWithRelations,
): Promise<DishWithRelations | undefined> {
  try {
    const upsertedDish = await db
      .insert(dish)
      .values(params)
      .onConflictDoUpdate({
        target: dish.id,
        set: params,
      })
      .returning();

    const upsertedDietRestriction = await db
      .insert(dietRestriction)
      .values(params.dietRestriction)
      .onConflictDoUpdate({
        target: [dietRestriction.dishId],
        set: params.dietRestriction,
      })
      .returning();

    const upsertedNutritionInfo = await db
      .insert(nutritionInfo)
      .values(params.nutritionInfo)
      .onConflictDoUpdate({
        target: [nutritionInfo.dishId],
        set: params.nutritionInfo,
      })
      .returning();

    // TODO: do it without the bangs
    return {
      ...upsertedDish[0]!,
      dietRestriction: upsertedDietRestriction[0]!,
      nutritionInfo: upsertedNutritionInfo[0]!,
    };
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
  }
}
