import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const event = pgTable(
  "Event",
  {
    title: text("title").notNull(),
    link: text("link").notNull(),
    description: text("description").notNull(),
    date: timestamp("date", { precision: 3, mode: "string" }).notNull(),
    createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 3,
      mode: "string",
    }).notNull(),
  },
  (table) => {
    return {
      eventPkey: primaryKey({
        columns: [table.title, table.link, table.date],
        name: "Event_pkey",
      }),
    };
  },
);
