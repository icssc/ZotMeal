import { pgTable, text } from "drizzle-orm/pg-core";

export const pushToken = pgTable("PushToken", {
  token: text("token").primaryKey().notNull(),
});
