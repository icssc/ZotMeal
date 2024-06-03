import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { PinTable } from "./pin-table";
import { RatingTable } from "./rating-table";
import { metadataColumns } from "./utils";

export const UserTable = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  ...metadataColumns,
});

/**
 * User has many:
 *
 * {@linkcode PinTable}
 * {@linkcode RatingTable}
 */
export const userRelations = relations(UserTable, ({ many }) => ({
  pins: many(PinTable),
  ratings: many(RatingTable),
}));

export type User = typeof UserTable.$inferInsert;

export const UserSchema = createInsertSchema(UserTable);
