import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { dish } from "./dish";

export const nutritionInfo = pgTable("NutritionInfo", {
  dishId: text("dishId")
    .primaryKey()
    .notNull()
    .references(() => dish.id, { onDelete: "restrict", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  servingSize: text("servingSize"),
  servingUnit: text("servingUnit"),
  calories: text("calories"),
  caloriesFromFat: text("caloriesFromFat"),
  totalFat: text("totalFat"),
  transFat: text("transFat"),
  cholesterol: text("cholesterol"),
  sodium: text("sodium"),
  totalCarbohydrates: text("totalCarbohydrates"),
  dietaryFiber: text("dietaryFiber"),
  sugars: text("sugars"),
  protein: text("protein"),
  vitaminA: text("vitaminA"),
  vitaminC: text("vitaminC"),
  calcium: text("calcium"),
  iron: text("iron"),
  saturatedFat: text("saturatedFat"),
});
