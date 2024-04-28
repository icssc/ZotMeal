import { relations } from "drizzle-orm";
import { date, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import type { StationWithRelations } from "./station-table";
import { DishMenuStationJoint } from "./dish-menu-station-joint";
import { RestaurantTable } from "./restaurant-table";
import { updatedAtColumnPostgres } from "./utils";

export const PeriodEnum = pgEnum("period", [
  "latenight",
  "dinner",
  "lunch",
  "brunch",
  "breakfast",
]);

export const MenuTable = pgTable("menus", {
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
  start: timestamp("start", { precision: 3, mode: "string" }).notNull(),
  end: timestamp("end", { precision: 3, mode: "string" }).notNull(),
  price: text("price").notNull(),
  period: PeriodEnum("period").notNull(),
});

export const menuRelations = relations(MenuTable, ({ one, many }) => ({
  // * Restaurant <- Menu: One-to-Many (One restaurant has many menus).
  restaurant: one(RestaurantTable, {
    fields: [MenuTable.restaurantId],
    references: [RestaurantTable.id],
  }),
  // * Many-to-Many: dish menu station
  dishMenuStationJoint: many(DishMenuStationJoint),
}));

export const MenuSchema = createInsertSchema(MenuTable);
export type Menu = typeof MenuTable.$inferInsert;
export interface MenuWithRelations extends Menu {
  stations: StationWithRelations[];
}

export type Period = Menu["period"];
