import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { DietRestriction } from "./dietRestriction";
import { dietRestriction } from "./dietRestriction";
import type { NutritionInfo } from "./nutritionInfo";
import { nutritionInfo } from "./nutritionInfo";
import { station } from "./station";

export const dish = pgTable(
  "Dish",
  {
    id: text("id").primaryKey().notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).defaultNow().notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
  }
);

export const dishRelations = relations(dish, ({ one, many }) => ({
  // * Dish ↔ DietRestriction: One-to-One (Each dish has a set of diet restrictions).
  dietRestriction: one(dietRestriction, {
    fields: [dish.id],
    references: [dietRestriction.dishId],
  }),
  // * Dish ↔ NutritionInfo: One-to-One (Each dish has nutritional information).
  nutritionInfo: one(nutritionInfo, {
    fields: [dish.id],
    references: [nutritionInfo.dishId],
  }),
  // * Station <- Dish: One-to-Many (Each station has a set of dishes).
  station: many(station, { fields: [dish.stationId], references: [station.id] }),
}));

export type Dish = typeof dish.$inferInsert;
export interface DishWithRelations extends Dish {
  dietRestriction: DietRestriction;
  nutritionInfo: NutritionInfo;
}
