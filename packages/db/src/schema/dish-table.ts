import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import type { DietRestriction } from "./diet-restriction-table";
import type { NutritionInfo } from "./nutrition-info-table";
import { DietRestrictionTable } from "./diet-restriction-table";
import { DishMenuStationJointTable } from "./dish-menu-station-joint";
import { NutritionInfoTable } from "./nutrition-info-table";
import { metadataColumns } from "./utils";

export const DishTable = pgTable("dishes", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),

  ...metadataColumns,
});

/**
 * Dish has one:
 *
 * {@linkcode DietRestrictionTable}
 * {@linkcode NutritionInfoTable}
 *
 * Dish has many:
 *
 * {@linkcode DishMenuStationJointTable}
 */
export const dishRelations = relations(DishTable, ({ one, many }) => ({
  dietRestriction: one(DietRestrictionTable, {
    fields: [DishTable.id],
    references: [DietRestrictionTable.dishId],
  }),
  nutritionInfo: one(NutritionInfoTable, {
    fields: [DishTable.id],
    references: [NutritionInfoTable.dishId],
  }),
  dishMenuStationJoint: many(DishMenuStationJointTable),
}));

export type Dish = typeof DishTable.$inferInsert;
export interface DishWithRelations extends Dish {
  dietRestriction: DietRestriction;
  nutritionInfo: NutritionInfo;
  menuId: string;
  stationId: string;
}
