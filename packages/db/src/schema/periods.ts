import { pgTable, text, time, date, primaryKey } from "drizzle-orm/pg-core";

import { metadataColumns } from "./utils";

export const periods = pgTable("periods", {
  id: text("id").notNull(),
  date: date("date").notNull(),
  startTime: time("start").notNull(),
  endTime: time("end").notNull(),
  name: text("name").notNull(),
  ...metadataColumns,
}, (table) => ({ 
  pk: primaryKey({ columns: [table.id, table.date] })
}));

/** A meal period, e.g. breakfast. */
export type InsertPeriod = typeof periods.$inferInsert;
export type SelectPeriod = typeof periods.$inferSelect;
