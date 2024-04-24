import { exec } from "child_process";
import { promisify } from "util";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import { schema } from "./schema";

export const createClient = async (
  connectionString: string,
): Promise<pg.Client> => {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = new pg.Client({ connectionString });
  await client.connect();

  return client;
};

export const createPool = (connectionString: string): pg.Pool => {
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const pool = new pg.Pool({
    connectionString,
    max: 1,
  });
  return pool;
};

export const createDrizzle = async (connectionString: string) =>
  drizzle(await createClient(connectionString), { schema });

// utility for api tests -- meant to be run in test-setup.ts
export async function pushSchema(connectionString: string) {
  const client = new pg.Client({ connectionString });
  await client.connect();
  await promisify(exec)(
    `npx drizzle-kit push:pg --config=../db/test-config.ts`,
    {
      env: {
        DB_URL: connectionString,
      },
    },
  );
  await client.end();
}

export type Drizzle = Awaited<ReturnType<typeof createDrizzle>>;

export * from "drizzle-orm";
export * from "./schema";
