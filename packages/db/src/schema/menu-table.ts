import { relations } from "drizzle-orm";
import { date, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import type { StationWithRelations } from "./station-table";
import { DishMenuStationJointTable } from "./dish-menu-station-joint";
import { RestaurantTable } from "./restaurant-table";
import { metadataColumns } from "./utils";

export const PeriodEnum = pgEnum("period", [
  "breakfast",
  "brunch",
  "dinner",
  "latenight",
  "lunch",
]);

export const MenuTable = pgTable("menus", {
  id: text("id").primaryKey().notNull(),
  date: date("date").notNull(),
  restaurantId: text("restaurant_id")
    .notNull()
    .references(() => RestaurantTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),

  start: timestamp("start", { precision: 3, mode: "string" }).notNull(),
  end: timestamp("end", { precision: 3, mode: "string" }).notNull(),
  price: text("price").notNull(),
  period: PeriodEnum("period").notNull(),

  ...metadataColumns,
});

/**
 * Menu has one:
 *
 * {@linkcode RestaurantTable}
 *
 * Menu has many:
 *
 * {@linkcode DishMenuStationJointTable}
 */
export const menuRelations = relations(MenuTable, ({ one, many }) => ({
  restaurant: one(RestaurantTable, {
    fields: [MenuTable.restaurantId],
    references: [RestaurantTable.id],
  }),
  dishMenuStationJoint: many(DishMenuStationJointTable),
}));

export const MenuSchema = createInsertSchema(MenuTable);
export type Menu = typeof MenuTable.$inferInsert;
export interface MenuWithRelations extends Menu {
  stations: StationWithRelations[];
}

export type Period = Menu["period"];
