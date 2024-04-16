import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { DishTable } from "./dish-table";
import { updatedAtColumnPostgres } from "./utils";

export const NutritionInfoTable = pgTable("nutrition_info", {
  dishId: text("dish_id")
    .primaryKey()
    .notNull()
    .references(() => DishTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: updatedAtColumnPostgres,
  servingSize: text("serving_size"),
  servingUnit: text("serving_unit"),
  calories: text("calories"),
  caloriesFromFat: text("calories_from_fat"),
  totalFat: text("total_fat_g"),
  transFat: text("trans_fat_g"),
  saturatedFatG: text("saturated_fat_g"),
  cholesterolMg: text("cholesterol_mg"),
  sodium: text("sodium_mg"),
  totalCarbohydrates: text("total_carbs_g"),
  dietaryFiber: text("dietary_fiber_g"),
  sugars: text("sugars_mg"),
  protein: text("protein_g"),
  vitaminAIU: text("vitamin_a_iu"),
  vitaminCIU: text("vitamin_c_iu"),
  calciumMg: text("calcium_mg"),
  ironMg: text("iron_mg"),
});

export type NutritionInfo = typeof NutritionInfoTable.$inferInsert;
