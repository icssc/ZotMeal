import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { RestaurantTable } from "./restaurant-table";
import { metadataColumns } from "./utils";

export const EventTable = pgTable(
  "events",
  {
    title: text("title").notNull(),
    image: text("image"),
    restaurantId: text("restaurant_id").notNull(),
    shortDescription: text("short_description"),
    longDescription: text("long_description"),
    start: timestamp("start").notNull(),
    end: timestamp("end").notNull(),

    ...metadataColumns,
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.title, table.restaurantId, table.start],
      }),
    };
  },
);

/**
 * Event has one:
 *
 * {@linkcode RestaurantTable}
 */
export const eventRelation = relations(EventTable, ({ one }) => ({
  restaurant: one(RestaurantTable, {
    fields: [EventTable.restaurantId],
    references: [RestaurantTable.id],
  }),
}));
export type Event = typeof EventTable.$inferInsert;
export const EventSchema = createInsertSchema(EventTable);
