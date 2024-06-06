import type { PoolConfig } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

export const pool = (config: PoolConfig): Pool => new Pool(config);

/**
 * Caller must do `pool.end()` when finished with db.
 */
export const createDrizzle = (config: PoolConfig) =>
  drizzle(pool({ ...config }), { schema });

export type Drizzle = ReturnType<typeof createDrizzle>;
export * from "./schema";
