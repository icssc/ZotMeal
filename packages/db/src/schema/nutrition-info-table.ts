import { pgTable, text } from "drizzle-orm/pg-core";

import { DishTable } from "./dish-table";
import { metadataColumns } from "./utils";

export const NutritionInfoTable = pgTable("nutrition_info", {
  dishId: text("dish_id")
    .primaryKey()
    .notNull()
    .references(() => DishTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  servingSize: text("serving_size"),
  servingUnit: text("serving_unit"),
  calories: text("calories"),
  caloriesFromFat: text("calories_from_fat"),
  totalFatG: text("total_fat_g"),
  transFatG: text("trans_fat_g"),
  saturatedFatG: text("saturated_fat_g"),
  cholesterolMg: text("cholesterol_mg"),
  sodiumMg: text("sodium_mg"),
  totalCarbsG: text("total_carbs_g"),
  dietaryFiberG: text("dietary_fiber_g"),
  sugarsMg: text("sugars_mg"),
  proteinG: text("protein_g"),
  vitaminAIU: text("vitamin_a_iu"),
  vitaminCIU: text("vitamin_c_iu"),
  calciumMg: text("calcium_mg"),
  ironMg: text("iron_mg"),

  ...metadataColumns,
});

export type NutritionInfo = typeof NutritionInfoTable.$inferInsert;
