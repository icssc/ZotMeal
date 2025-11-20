import { pgTable, text } from "drizzle-orm/pg-core";

import { dishes } from "./dishes";
import { metadataColumns } from "./utils";

export const nutritionInfos = pgTable("nutrition_infos", {
  dishId: text("dish_id")
    .primaryKey()
    .references(() => dishes.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  servingSize: text("serving_size"),
  servingUnit: text("serving_unit"),
  calories: text("calories"),
  totalFatG: text("total_fat_g"),
  transFatG: text("trans_fat_g"),
  saturatedFatG: text("saturated_fat_g"),
  cholesterolMg: text("cholesterol_mg"),
  sodiumMg: text("sodium_mg"),
  totalCarbsG: text("total_carbs_g"),
  dietaryFiberG: text("dietary_fiber_g"),
  sugarsG: text("sugars_g"),
  proteinG: text("protein_g"),
  calciumMg: text("calcium"),
  ironMg: text("iron"),
  vitaminAIU: text("vitamin_a"),
  vitaminCIU: text("vitamin_c"),
  ...metadataColumns,
});

/** The nutrition information of a dish. */
export type InsertNutritionInfo = typeof nutritionInfos.$inferInsert;
export type SelectNutritionInfo = typeof nutritionInfos.$inferSelect;
