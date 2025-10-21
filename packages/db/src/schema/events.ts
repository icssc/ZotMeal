import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { restaurantIdEnum } from "./enums";
import { restaurants } from "./restaurants";
import { metadataColumns } from "./utils";

export const events = pgTable(
  "events",
  {
    title: text("title").notNull(),
    image: text("image"),
    restaurantId: restaurantIdEnum("restaurant_id")
      .notNull()
      .references(() => restaurants.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    shortDescription: text("short_description"),
    longDescription: text("long_description"),
    start: timestamp("start").notNull(),
    end: timestamp("end"),
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

export const eventsRelations = relations(events, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [events.restaurantId],
    references: [restaurants.id],
  }),
}));

/** A special event at a restaurant. */
export type InsertEvent = typeof events.$inferInsert;
export type SelectEvent = typeof events.$inferSelect;
export const EventSchema = createInsertSchema(events);
