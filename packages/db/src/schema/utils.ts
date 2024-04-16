import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export const updatedAtColumnPostgres = timestamp("updated_at", {
  precision: 3,
  mode: "string",
})
  .default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`)
  .notNull();
