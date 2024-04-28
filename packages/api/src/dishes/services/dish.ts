import type {
  Dish,
  DishMenuStationJoint,
  DishWithRelations,
  Drizzle,
} from "@zotmeal/db";
import {
  DietRestrictionTable,
  DishMenuStationJointTable,
  DishTable,
  NutritionInfoTable,
} from "@zotmeal/db";

export async function upsertDish(db: Drizzle, params: DishWithRelations) {
  try {
    // Dish params for the dish table
    const dishParams = {
      id: params.id,
      name: params.name,
      description: params.description,
      category: params.category,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    } satisfies Dish;

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

export async function insertDishMenuStationJoint(
  db: Drizzle,
  params: DishWithRelations,
) {
  try {
    // Dish params for the joint table
    const jointParams = {
      dishId: params.id,
      stationId: params.stationId,
      menuId: params.menuId,
    } satisfies DishMenuStationJoint;

    // Insert into dish-menu-station joint table
    await db
      .insert(DishMenuStationJointTable)
      .values(jointParams)
      .onConflictDoNothing();
  } catch (e) {
    console.error(e);
    throw e;
  }
}
