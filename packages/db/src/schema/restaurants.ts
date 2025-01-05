import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

import { restaurantIdEnum, restaurantNameEnum } from "./enums";
import { events } from "./events";
import { menus } from "./menus";
import { stations } from "./stations";
import { metadataColumns } from "./utils";

export const restaurants = pgTable("restaurants", {
  id: restaurantIdEnum("id").primaryKey(),
  name: restaurantNameEnum("name").notNull(),
  ...metadataColumns,
});

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  stations: many(stations),
  menus: many(menus),
  events: many(events),
}));

/**
 * A restaurant has many:
 *
 * {@linkcode stations}
 * {@linkcode menus}
 * {@linkcode events}
 */
export type Restaurant = typeof restaurants.$inferInsert;
