import { relations } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";

import { DietRestriction, dietRestrictions } from "./dietRestrictions";
import { dishesToMenus } from "./menus";
import { NutritionInfo, nutritionInfos } from "./nutritionInfos";
import { stations } from "./stations";
import { metadataColumns } from "./utils";

export const dishes = pgTable("dishes", {
  id: text("id").primaryKey(),
  stationId: text("station_id")
    .notNull()
    .references(() => stations.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  /** Defaults to "Other" if not specified. */
  category: text("category").notNull().default("Other"),
  numRatings: integer("num_ratings").default(0).notNull(),
  totalRating: integer("total_rating").default(0).notNull(),
  ...metadataColumns,
});

export const dishRelations = relations(dishes, ({ one, many }) => ({
  dishesToMenus: many(dishesToMenus),
  station: one(stations, {
    fields: [dishes.stationId],
    references: [stations.id],
  }),
  dietRestriction: one(dietRestrictions, {
    fields: [dishes.id],
    references: [dietRestrictions.dishId],
  }),
  nutritionInfo: one(nutritionInfos, {
    fields: [dishes.id],
    references: [nutritionInfos.dishId],
  }),
}));

/** A dish at a restaurant. */
export type Dish = typeof dishes.$inferInsert;
export interface DishWithRelations extends Dish {
  dietRestriction: DietRestriction;
  nutritionInfo: NutritionInfo;
}
