import { relations } from "drizzle-orm";
import { date, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import type { StationWithRelations } from "./station-table";
import { DishMenuStationJointTable } from "./dish-menu-station-joint";
import { periodNameEnum, restaurantIdEnum } from "./enums";
import { RestaurantTable } from "./restaurant-table";
import { metadataColumns } from "./utils";

export const MenuTable = pgTable("menus", {
  id: text("id").primaryKey().notNull(),
  date: date("date").notNull(),
  restaurantId: restaurantIdEnum("restaurant_id")
    .notNull()
    .references(() => RestaurantTable.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),

  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  price: text("price").notNull(),
  period: periodNameEnum("period").notNull(),

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
