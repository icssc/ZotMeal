import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import type { DishWithRelations } from "./dish-table";
import { DishTable } from "./dish-table";
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
  // * Station <- Dish: One-to-Many (Each station has a set of dishes).
  dishes: many(DishTable),
  // * Menu <- Station: One-to-Many (Each menu has many stations).
  // * Restaurant <- Station: One-to-Many (One restaurant has many stations).
  restaurant: one(RestaurantTable, {
    fields: [StationTable.restaurantId],
    references: [RestaurantTable.id],
  }),
}));

export type Station = typeof StationTable.$inferInsert;
export interface StationWithRelations extends Station {
  dishes: DishWithRelations[];
}
