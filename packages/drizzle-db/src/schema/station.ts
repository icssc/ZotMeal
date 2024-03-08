import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { dish } from "./dish";
import { menu } from "./menu";
import { restaurant } from "./restaurant";

export const station = pgTable("Station", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).notNull(),
  name: text("name").notNull(),
  restaurantId: text("restaurantId")
    .notNull()
    .references(() => restaurant.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  menuId: text("menuId")
    .notNull()
    .references(() => menu.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});

export const stationRelations = relations(station, ({ one, many }) => ({
  // * Station <- Dish: One-to-Many (Each station has a set of dishes).
  dishes: many(dish),
  // * Menu <- Station: One-to-Many (Each menu has many stations).
  menu: one(menu, {
    fields: [station.menuId],
    references: [menu.id],
  }),
  // * Restaurant <- Station: One-to-Many (One restaurant has many stations).
  restaurant: one(restaurant, {
    fields: [station.restaurantId],
    references: [restaurant.id],
  }),
}));
