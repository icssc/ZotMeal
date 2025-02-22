import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { pins } from "./pins";
import { ratings } from "./ratings";
import { metadataColumns } from "./utils";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ...metadataColumns,
});

export const usersRelations = relations(users, ({ many }) => ({
  pins: many(pins),
  ratings: many(ratings),
}));

/**
 * A user of the app.
 *
 * A user has many:
 *
 * {@linkcode pins}
 * {@linkcode ratings}
 *
 */
export type InputUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export const UserSchema = createInsertSchema(users);
