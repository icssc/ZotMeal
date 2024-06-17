import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const pushTokens = pgTable("push_tokens", {
  token: text("token").primaryKey(),
});

export const PushTokenSchema = createInsertSchema(pushTokens);
export type PushToken = typeof pushTokens.$inferInsert;
