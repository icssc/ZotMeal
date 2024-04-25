import { exec } from "child_process";
import { promisify } from "util";
import type { PoolConfig } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { schema } from "./schema";

export const pool = (config: PoolConfig): Pool => new Pool(config);

// caller must do `await pool.end()` when finished with db
export async function createDrizzle(connectionString: string) {
  // retry connecting to db 5 times with backoff
  // mainly for for when testcontainer is not ready
  for (let numRetries = 0; numRetries < 5; numRetries++) {
    try {
      console.log(`(attempt ${numRetries + 1}) connecting to db...`);
      const client = await pool({
        connectionString,
      }).connect();
      console.log(`connected to db.`);
      return drizzle(client, { schema });
    } catch (err) {
      if (!(err instanceof Error)) throw err;
      if (err.toString().includes("ECONNREFUSED") && numRetries === 4) {
        console.error("Failed to connect to db after 5 retries.");
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 250 * numRetries));
    }
  }
  throw new Error("unreachable");
}

// utility for api tests -- meant to be run in test-setup.ts
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

export type Drizzle = Awaited<ReturnType<typeof createDrizzle>>;

export * from "drizzle-orm";
export * from "./schema";
