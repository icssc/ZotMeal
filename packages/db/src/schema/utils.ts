import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export const updatedAtColumnPostgres = timestamp("updated_at", {
  mode: "string",
}).default(sql`CURRENT_TIMESTAMP(3)`);
