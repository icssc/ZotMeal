import type { InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { station } from "./station";

export const dishes = pgTable("dishes", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  stationId: text("stationId")
    .notNull()
    .references(() => station.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});

export type Dish = InferSelectModel<typeof dishes>;

export const dietRestrictions = pgTable("diet_restrictions", {
  dishId: text("dishId")
    .primaryKey()
    .notNull()
    .references(() => dishes.id, { onDelete: "restrict", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  containsFish: boolean("containsFish"),
  containsMilk: boolean("containsMilk"),
  containsPeanuts: boolean("containsPeanuts"),
  containsSesame: boolean("containsSesame"),
  containsShellfish: boolean("containsShellfish"),
  containSoy: boolean("containSoy"),
  containsTreeNuts: boolean("containsTreeNuts"),
  containsWheat: boolean("containsWheat"),
  isGlutenFree: boolean("isGlutenFree"),
  isHalal: boolean("isHalal"),
  isKosher: boolean("isKosher"),
  isLocallyGrown: boolean("isLocallyGrown"),
  isOrganic: boolean("isOrganic"),
  isVegan: boolean("isVegan"),
  isVegetarian: boolean("isVegetarian"),
});

export const nutritionInfo = pgTable("nutrition_info", {
  dishId: text("dishId")
    .primaryKey()
    .notNull()
    .references(() => dishes.id, { onDelete: "restrict", onUpdate: "cascade" }),
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
  sodum: text("sodum"),
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

export const dishRelations = relations(dishes, ({ one }) => ({
  // * Dish ↔ DietRestriction: One-to-One (Each dish has a set of diet restrictions).
  dietRestriction: one(dietRestrictions, {
    fields: [dishes.id],
    references: [dietRestrictions.dishId],
  }),
  // * Dish ↔ NutritionInfo: One-to-One (Each dish has nutritional information).
  nutritionInfo: one(nutritionInfo, {
    fields: [dishes.id],
    references: [nutritionInfo.dishId],
  }),
  // * Station <- Dish: One-to-Many (Each station has a set of dishes).
  station: one(station, {
    fields: [dishes.stationId],
    references: [station.id],
  }),
}));
