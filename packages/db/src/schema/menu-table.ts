import { relations } from "drizzle-orm";
import { date, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import type { StationWithRelations } from "./station-table";
import { RestaurantTable } from "./restaurant-table";
import { StationTable } from "./station-table";
import { updatedAtColumnPostgres } from "./utils";

export const MenuTable = pgTable("Menu", {
  id: text("id").primaryKey().notNull(),
  date: date("date").notNull(),
  restaurantId: text("restaurantId")
    .notNull()
    .references(() => RestaurantTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),

  createdAt: timestamp("created_at", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: updatedAtColumnPostgres,
});

export const menuRelations = relations(MenuTable, ({ one, many }) => ({
  // * Menu <- Station: One-to-Many (Each menu has many stations).
  stations: many(StationTable),
  // * MenuPeriod <- Menu: One-to-Many (One menu period can be associated with many menus).
  // * Restaurant <- Menu: One-to-Many (One restaurant has many menus).
  restaurant: one(RestaurantTable, {
    fields: [MenuTable.restaurantId],
    references: [RestaurantTable.id],
  }),
}));

export const MenuSchema = createInsertSchema(MenuTable);
export type Menu = typeof MenuTable.$inferInsert;
export interface MenuWithRelations extends Menu {
  stations: StationWithRelations[];
}
