import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const PushTokenTable = pgTable("push_token", {
  token: text("token").primaryKey().notNull(),
});

export const PushTokenSchema = createInsertSchema(PushTokenTable);
export type PushToken = typeof PushTokenTable.$inferInsert;
