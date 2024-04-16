import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const PushTokenTable = pgTable("PushToken", {
  token: text("token").primaryKey().notNull(),
});

export const PushTokenSchema = createInsertSchema(PushTokenTable);
export type PushToken = typeof PushTokenTable.$inferInsert;
