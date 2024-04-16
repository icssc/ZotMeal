import {
  date,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { updatedAtColumnPostgres } from "./utils";

export const event = pgTable(
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
      eventPkey: primaryKey({
        columns: [table.title, table.date, table.restaurantId],
        name: "Event_pkey",
      }),
    };
  },
);

export type Event = typeof event.$inferInsert;
export const EventSchema = createInsertSchema(event);
