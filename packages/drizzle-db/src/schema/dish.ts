import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { dietRestriction } from "./dietRestriction";
import { nutritionInfo } from "./nutritionInfo";
import { station } from "./station";

export const dish = pgTable("Dish", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  stationId: text("stationId")
    .notNull()
    .references(() => station.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});

export const dishRelations = relations(dish, ({ one }) => ({
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
  station: one(station, { fields: [dish.stationId], references: [station.id] }),
}));