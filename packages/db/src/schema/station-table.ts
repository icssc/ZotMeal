import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import type { DishWithRelations } from "./dish-table";
import { DishMenuStationJointTable } from "./dish-menu-station-joint";
import { restaurantIdEnum } from "./enums";
import { RestaurantTable } from "./restaurant-table";
import { metadataColumns } from "./utils";

export const StationTable = pgTable("stations", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  restaurantId: restaurantIdEnum("restaurant_id")
    .notNull()
    .references(() => RestaurantTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),

  ...metadataColumns,
});

/**
 * Station has one:
 *
 * {@linkcode RestaurantTable}
 *
 * Station has many:
 *
 * {@linkcode DishMenuStationJointTable}
 */
export const stationRelations = relations(StationTable, ({ one, many }) => ({
  restaurant: one(RestaurantTable, {
    fields: [StationTable.restaurantId],
    references: [RestaurantTable.id],
  }),
  dishMenuStationJoint: many(DishMenuStationJointTable),
}));

export type Station = typeof StationTable.$inferInsert;

export interface StationWithRelations extends Station {
  dishes: DishWithRelations[];
}
