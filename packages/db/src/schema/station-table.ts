import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import type { DishWithRelations } from "./dish-table";
import { DishMenuStationJoint } from "./dish-menu-station-joint";
import { RestaurantTable } from "./restaurant-table";
import { updatedAtColumnPostgres } from "./utils";

export const StationTable = pgTable("stations", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: updatedAtColumnPostgres,
  name: text("name").notNull().unique(),
  restaurantId: text("restaurantId")
    .notNull()
    .references(() => RestaurantTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});

export const stationRelations = relations(StationTable, ({ one, many }) => ({
  // * Restaurant <- Station: One-to-Many (One restaurant has many stations).
  restaurant: one(RestaurantTable, {
    fields: [StationTable.restaurantId],
    references: [RestaurantTable.id],
  }),
  // * Many-to-Many: dish menu station
  dishMenuStationJoint: many(DishMenuStationJoint),
}));

export type Station = typeof StationTable.$inferInsert;
export interface StationWithRelations extends Station {
  dishes: DishWithRelations[];
}
