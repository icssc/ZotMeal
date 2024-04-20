import type { Drizzle } from "@zotmeal/db";
import type { Dish, DishWithRelations, DishMenuStationJointSchema} from "@zotmeal/db/src/schema";
import {
  DietRestrictionTable,
  DishTable,
  NutritionInfoTable,
  DishMenuStationJoint,
} from "@zotmeal/db/src/schema";

export async function upsertDish(
  db: Drizzle,
  params: DishWithRelations,
) {
  try {
    // Dish params for the dish table
    const dishParams: Dish = {
      id: params.id,
      name: params.name,
      description: params.description,
      category: params.category,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    };

    // Insertion params for the dish-menu-station join table
    const dishJointParams: DishMenuStationJointSchema = {
      dishId: params.id,
      menuId: params.menuId,
      stationId: params.stationId
    };

    // Inserting into dish table
    const dish = await db
      .insert(DishTable)
      .values(dishParams)
      .onConflictDoUpdate({
        target: DishTable.id,
        set: dishParams,
      })
      .returning();

    const dietRestriction = await db
      .insert(DietRestrictionTable)
      .values(params.dietRestriction)
      .onConflictDoUpdate({
        target: [DietRestrictionTable.dishId],
        set: params.dietRestriction,
      })
      .returning();

    const nutritionInfo = await db
      .insert(NutritionInfoTable)
      .values(params.nutritionInfo)
      .onConflictDoUpdate({
        target: [NutritionInfoTable.dishId],
        set: params.nutritionInfo,
      })
      .returning();

    // Insert into dish-menu-station joint table
    await db
      .insert(DishMenuStationJoint)
      .values(dishJointParams)
      .onConflictDoNothing();

    // TODO: do it without the bangs
    return {
      ...dish[0]!,
      dietRestriction: dietRestriction[0]!,
      nutritionInfo: nutritionInfo[0]!,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
}
