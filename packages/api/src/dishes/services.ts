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

export async function upsertDish(
  db: Drizzle,
  params: DishWithRelations,
): Promise<Omit<DishWithRelations, "menuId" | "stationId">> {
  try {
    const dishParams = {
      id: params.id,
      name: params.name,
      description: params.description,
      category: params.category,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    } satisfies Dish;

    const dishResult = await db
      .insert(DishTable)
      .values(dishParams)
      .onConflictDoUpdate({
        target: DishTable.id,
        set: dishParams,
      })
      .returning();

    const dish = dishResult[0];

    if (!dish) throw new Error("error upserting dish");

    const dietRestrictionResult = await db
      .insert(DietRestrictionTable)
      .values(params.dietRestriction)
      .onConflictDoUpdate({
        target: [DietRestrictionTable.dishId],
        set: params.dietRestriction,
      })
      .returning();

    const dietRestriction = dietRestrictionResult[0];

    if (!dietRestriction) throw new Error("error upserting dietRestriction");

    const nutritionInfoResult = await db
      .insert(NutritionInfoTable)
      .values(params.nutritionInfo)
      .onConflictDoUpdate({
        target: [NutritionInfoTable.dishId],
        set: params.nutritionInfo,
      })
      .returning();

    const nutritionInfo = nutritionInfoResult[0];

    if (!nutritionInfo) throw new Error("error upserting nutritionInfo");

    return {
      ...dish,
      dietRestriction,
      nutritionInfo,
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function insertDishMenuStationJoint(
  db: Drizzle,
  params: DishMenuStationJoint,
): Promise<void> {
  try {
    await db
      .insert(DishMenuStationJointTable)
      .values(params)
      .onConflictDoNothing();
  } catch (e) {
    console.error(e);
    throw e;
  }
}
