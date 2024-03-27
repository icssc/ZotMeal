import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { menu } from "./menu";

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

export const menuPeriodRelations = relations(menuPeriod, ({ many }) => ({
  // * MenuPeriod <- Menu: One-to-Many (One menu period can be associated with many menus).
  menu: many(menu),
}));
