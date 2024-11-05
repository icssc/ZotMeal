import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

import { dishes } from "./dishes";
import { restaurantIdEnum } from "./enums";
import { restaurants } from "./restaurants";
import { metadataColumns } from "./utils";

export const stations = pgTable("stations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  restaurantId: restaurantIdEnum("restaurant_id")
    .notNull()
    .references(() => restaurants.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  ...metadataColumns,
});

export const stationsRelations = relations(stations, ({ one, many }) => ({
  dishes: many(dishes),
  restaurant: one(restaurants, {
    fields: [stations.restaurantId],
    references: [restaurants.id],
  }),
}));

/**
 * A station of a restaurant.
 *
 * A station has many:
 *
 * {@linkcode dishes}
 */
export type Station = typeof stations.$inferInsert;
