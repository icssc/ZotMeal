import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { restaurantIdEnum, restaurantNameEnum } from "./enums";
import { EventTable } from "./event-table";
import { MenuTable } from "./menu-table";
import { StationTable } from "./station-table";
import { metadataColumns } from "./utils";

export const RestaurantTable = pgTable("restaurants", {
  id: restaurantIdEnum("id").primaryKey().notNull(),
  name: restaurantNameEnum("name").notNull(),
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
