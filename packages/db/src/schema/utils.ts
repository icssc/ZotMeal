import { timestamp } from "drizzle-orm/pg-core";

export const createdAt = timestamp("created_at").defaultNow().notNull();
export const updatedAt = timestamp("updated_at").$onUpdate(() => new Date());
export const metadataColumns = { createdAt, updatedAt };
