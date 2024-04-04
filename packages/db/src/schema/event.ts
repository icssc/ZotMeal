import { date, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { restaurantName } from "./restaurant";
import { createInsertSchema } from "drizzle-zod";

export const event = pgTable(
  "Event",
  {
    title: text("title").notNull(),
    image: text("image").notNull(),
    restaurant: restaurantName("restaurant").notNull(),
    description: text("description").notNull(),
    date: date("date", { mode: "date" }).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3, mode: "string", })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      eventPkey: primaryKey({
        columns: [table.title, table.date, table.restaurant],
        name: "Event_pkey",
      }),
    };
  },
);

export type Event = typeof event.$inferInsert;
export const EventSchema = createInsertSchema(event);
