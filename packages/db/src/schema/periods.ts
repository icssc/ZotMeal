import { pgTable, text, time } from "drizzle-orm/pg-core";

import { metadataColumns } from "./utils";

export const periods = pgTable("periods", {
  id: text("id").primaryKey(),
  startTime: time("start").notNull(),
  endTime: time("end").notNull(),
  name: text("name").notNull(),
  ...metadataColumns,
});

/** A meal period, e.g. breakfast. */
export type InsertPeriod = typeof periods.$inferInsert;
export type SelectPeriod = typeof periods.$inferSelect;
