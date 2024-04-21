import { relations } from "drizzle-orm";
import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { RestaurantTable } from "./restaurant-table";
import { updatedAtColumnPostgres } from "./utils";

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
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: updatedAtColumnPostgres,
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.title, table.restaurantId, table.start],
      }),
    };
  },
);

export const eventRelation = relations(EventTable, ({ one }) => ({
  // * Many Events to one restaurant
  restaurant: one(RestaurantTable, {
    fields: [EventTable.restaurantId],
    references: [RestaurantTable.id],
  }),
}));
export type Event = typeof EventTable.$inferInsert;
export const EventSchema = createInsertSchema(EventTable);
