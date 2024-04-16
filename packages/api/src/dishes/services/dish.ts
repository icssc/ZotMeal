import type { Drizzle } from "@zotmeal/db";
import type { DishWithRelations } from "@zotmeal/db/src/schema";
import {
  DietRestrictionTable,
  DishTable,
  NutritionInfoTable,
} from "@zotmeal/db/src/schema";

export async function upsertDish(
  db: Drizzle,
  params: DishWithRelations,
): Promise<DishWithRelations | undefined> {
  try {
    const dishParams = {
      id: params.id,
      name: params.name,
      description: params.description,
      category: params.category,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    };
    const upsertedDish = await db
      .insert(DishTable)
      .values(dishParams)
      .onConflictDoUpdate({
        target: DishTable.id,
        set: dishParams,
      })
      .returning();

    const upsertedDietRestriction = await db
      .insert(DietRestrictionTable)
      .values(params.dietRestriction)
      .onConflictDoUpdate({
        target: [DietRestrictionTable.dishId],
        set: params.dietRestriction,
      })
      .returning();

    const upsertedNutritionInfo = await db
      .insert(NutritionInfoTable)
      .values(params.nutritionInfo)
      .onConflictDoUpdate({
        target: [NutritionInfoTable.dishId],
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
