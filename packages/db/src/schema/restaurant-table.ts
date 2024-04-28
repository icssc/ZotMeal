import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { EventTable } from "./event-table";
import { MenuTable } from "./menu-table";
import { StationTable } from "./station-table";
import { metadataColumns } from "./utils";

export const RestaurantNameEnum = pgEnum("restaurant_name", [
  "anteatery",
  "brandywine",
]);

export const RestaurantTable = pgTable("restaurants", {
  id: text("id").primaryKey().notNull(),
  name: RestaurantNameEnum("name").notNull(),

  ...metadataColumns,
});

/**
 * Restaurant has many:
 *
 * {@linkcode StationTable}
 * {@linkcode MenuTable}
 * {@linkcode EventTable}
 */
export const restaurantRelations = relations(RestaurantTable, ({ many }) => ({
  station: many(StationTable),
  menu: many(MenuTable),
  event: many(EventTable),
}));

export type Restaurant = typeof RestaurantTable.$inferInsert;
export const RestaurantSchema = createInsertSchema(RestaurantTable);
