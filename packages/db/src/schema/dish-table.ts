import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import type { DietRestriction } from "./diet-restriction-table";
import type { NutritionInfo } from "./nutrition-info-table";
import { DietRestrictionTable } from "./diet-restriction-table";
import { DishMenuStationJoint } from "./dish-menu-station-joint";
import { NutritionInfoTable } from "./nutrition-info-table";
import { updatedAtColumnPostgres } from "./utils";

export const DishTable = pgTable("dishes", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),

  // Metadata
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: updatedAtColumnPostgres,
});

export const dishRelations = relations(DishTable, ({ one, many }) => ({
  // * Dish ↔ DietRestriction: One-to-One (Each dish has a set of diet restrictions).
  dietRestriction: one(DietRestrictionTable, {
    fields: [DishTable.id],
    references: [DietRestrictionTable.dishId],
  }),
  // * Dish ↔ NutritionInfo: One-to-One (Each dish has nutritional information).
  nutritionInfo: one(NutritionInfoTable, {
    fields: [DishTable.id],
    references: [NutritionInfoTable.dishId],
  }),
  // * Many-to-Many: dish menu station
  dishMenuStationJoint: many(DishMenuStationJoint),
}));

export type Dish = typeof DishTable.$inferInsert;
export interface DishWithRelations extends Dish {
  dietRestriction: DietRestriction;
  nutritionInfo: NutritionInfo;
  menuId: string;
  stationId: string;
}
