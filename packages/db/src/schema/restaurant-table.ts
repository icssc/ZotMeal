import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { MenuTable } from "./menu-table";
import { StationTable } from "./station-table";
import { updatedAtColumnPostgres } from "./utils";

export const RestaurantTable = pgTable("restaurants", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull().unique(),

  // Metadata
  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: updatedAtColumnPostgres,
  
});

export const restaurantRelations = relations(RestaurantTable, ({ many }) => ({
  // * Restaurant <- Station: One-to-Many (One restaurant has many stations).
  station: many(StationTable),
  // * Restaurant <- Menu: One-to-Many (One restaurant has many menus).
  menu: many(MenuTable),
}));

export type Restaurant = typeof RestaurantTable.$inferInsert;
export const RestaurantSchema = createInsertSchema(RestaurantTable);
