import { exec } from "child_process";
import { promisify } from "util";
import type { PoolConfig } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { schema } from "./schema";

export const pool = (config: PoolConfig): Pool => new Pool(config);

/**
 * Caller must do `pool.end()` when finished with db.
 */
export const createDrizzle = (config: PoolConfig) =>
  drizzle(pool({ ...config }), { schema });

/**
 * Push schema to test container, used in `test-setup.ts`.
 */
export async function pushSchema(connectionString: string) {
  await promisify(exec)(
    `pnpm drizzle-kit push:pg --config=../db/test-config.ts`,
    {
      env: {
        ...process.env,
        DB_URL: connectionString,
      },
    },
  );
}

export type Drizzle = ReturnType<typeof createDrizzle>;

export * from "drizzle-orm";
export * from "./schema";
