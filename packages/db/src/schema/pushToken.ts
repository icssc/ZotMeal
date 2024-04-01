import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const pushToken = pgTable("PushToken", {
  token: text("token").primaryKey().notNull(),
});

export const PushTokenSchema = createInsertSchema(pushToken);
export type PushToken = typeof pushToken.$inferInsert;
