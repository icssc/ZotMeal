import { pgEnum, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core/table";

import { restaurant } from "./restaurant";

export const menuPeriodName = pgEnum("MenuPeriodName", [
  "latenight",
  "dinner",
  "lunch",
  "brunch",
  "breakfast",
]);

export const menuPeriod = pgTable(
  "MenuPeriod",
  {
    id: text("id").primaryKey().notNull(),
    name: menuPeriodName("name").notNull(),
    start: timestamp("start", { precision: 3, mode: "string" }).notNull(),
    end: timestamp("end", { precision: 3, mode: "string" }).notNull(),
  },
  (table) => {
    return {
      nameKey: uniqueIndex("MenuPeriod_name_key").on(table.name),
    };
  },
);

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
