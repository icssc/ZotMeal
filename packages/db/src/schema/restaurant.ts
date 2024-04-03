import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { menu } from "./menu";
import { station } from "./station";
import { createInsertSchema } from "drizzle-zod";

export const restaurantName = pgEnum("RestaurantName", [
  "anteatery",
  "brandywine",
]);

export const restaurant = pgTable(
  "Restaurant",
  {
    id: text("id").primaryKey().notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string", })
      .defaultNow()
      .notNull(),
    name: restaurantName("name").notNull().unique(),
  },
  (table) => {
    return {
      nameKey: uniqueIndex("Restaurant_name_key").on(table.name),
    };
  },
);

export const restaurantRelations = relations(restaurant, ({ many }) => ({
  // * Restaurant <- Station: One-to-Many (One restaurant has many stations).
  station: many(station),
  // * Restaurant <- Menu: One-to-Many (One restaurant has many menus).
  menu: many(menu),
}));

export type Restaurant = typeof restaurant.$inferInsert;
export const RestaurantSchema = createInsertSchema(restaurant);
