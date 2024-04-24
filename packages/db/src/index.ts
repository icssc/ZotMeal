import { exec } from "child_process";
import { promisify } from "util";
import type { PoolConfig } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { schema } from "./schema";

export const pool = (config: PoolConfig): Pool => new Pool(config);

// call pool.end() when finished with db
export const createDrizzle = async (connectionString: string) =>
  drizzle(await pool({ connectionString }).connect(), { schema });

// utility for api tests -- meant to be run in test-setup.ts
export async function pushSchema(connectionString: string) {
  const client = await pool({ connectionString }).connect();
  await promisify(exec)(
    `npx drizzle-kit push:pg --config=../db/test-config.ts`,
    {
      env: {
        DB_URL: connectionString,
      },
    },
  );
  client.release();
}

export type Drizzle = Awaited<ReturnType<typeof createDrizzle>>;

export * from "drizzle-orm";
export * from "./schema";
