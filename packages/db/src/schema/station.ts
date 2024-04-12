import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import type { DishWithRelations } from "./dish";
import { dish } from "./dish";
import { menu } from "./menu";
import { restaurant } from "./restaurant";

export const station = pgTable("Station", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  restaurantId: text("restaurantId")
    .notNull()
    .references(() => restaurant.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
});

export const stationRelations = relations(station, ({ one, many }) => ({
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

// Join table for many-to-many relation
export const dishesToStations = pgTable('DishesToStations', {
  dishId: text("id").notNull(),
  stationId: text("id").primaryKey().notNull(),
  menuId: text("menuId")
    .notNull()
    .references(() => menu.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
}, (t) => ({
  pk: primaryKey( { columns: [t.dishId, t.stationId, t.menuId] } ),
}),
);

export const dishesToStationsRelations = relations(dishesToStations, ({ one }) => ({
  dishId: one(dish, {
    fields: [dishesToStations.dishId],
    references: [dish.id],
  }),
  user: one(station, {
    fields: [dishesToStations.stationId],
    references: [station.id],
  }),
}));

export type Station = typeof station.$inferInsert;
export interface StationWithRelations extends Station {
  dishes: DishWithRelations[];
}
