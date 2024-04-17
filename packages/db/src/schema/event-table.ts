import {
  date,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { updatedAtColumnPostgres } from "./utils";
import { RestaurantTable } from "./restaurant-table";
import { relations } from "drizzle-orm";

export const EventTable = pgTable(
  "Event",
  {
    title: text("title").notNull(),
    image: text("image").notNull(),
    restaurantId: text("restaurant_id").notNull(),
    description: text("description").notNull(),
    date: date("date", { mode: "date" }).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: updatedAtColumnPostgres,
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.title, table.restaurantId, table.date],
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
