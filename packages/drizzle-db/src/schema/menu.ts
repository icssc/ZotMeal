import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { menuPeriod } from "./menuPeriod";
import { restaurant } from "./restaurant";
import { station } from "./station";

export const menu = pgTable("Menu", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  periodId: text("periodId")
    .notNull()
    .references(() => menuPeriod.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  date: timestamp("date", { precision: 3, mode: "string" }).notNull(),
  restaurantId: text("restaurantId")
    .notNull()
    .references(() => restaurant.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});

export const menuRelations = relations(menu, ({ one, many }) => ({
  // * Menu <- Station: One-to-Many (Each menu has many stations).
  station: many(station),
  // * MenuPeriod <- Menu: One-to-Many (One menu period can be associated with many menus).
  menuPeriod: one(menuPeriod, {
    fields: [menu.periodId],
    references: [menuPeriod.id],
  }),
  // * Restaurant <- Menu: One-to-Many (One restaurant has many menus).
  restaurant: one(restaurant, {
    fields: [menu.restaurantId],
    references: [restaurant.id],
  }),
}));
