/* FOR THIS FILE TO WORK, YOU MUST INCLUDE A .ENV FILE IN THE apps/next DIRECTORY 
 YOU CAN COPY THE ROOT .ENV FILE WITH DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, & BETTER_AUTH_SECRET AND PASTE IT IN apps/next
 */
import type { PoolConfig } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { config } from "dotenv";
import { join } from "path";


// const envPath = join(__dirname, "../../../", ".env")
// // Get current file's directory
// config({ path: envPath });

// if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

console.log("db/src/index.ts: DATABASE_URL:", process.env.DATABASE_URL);

import * as schema from "./schema";
export const pool = (config: PoolConfig): Pool => new Pool(config);

/**
 * Create a drizzle instance with a connection string (add ssl or enable logs if needed)
 *
 * @example
 * const db = createDrizzle({ connectionString });
 *
 * Caller must do `pool.end()` when finished with db.
 *
 * TODO: change logs destination. @see https://orm.drizzle.team/docs/goodies#logging
 *
 */
export const createDrizzle = (config: PoolConfig, logger?: boolean) =>
  drizzle(pool({ ...config }), { schema, logger });

export type Drizzle = ReturnType<typeof createDrizzle>;
export * from "./schema";

export const db = createDrizzle({
  connectionString: process.env.DATABASE_URL,
});