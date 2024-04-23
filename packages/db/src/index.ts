import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import { schema } from "./schema";

// const connectionString = process.env.DATABASE_URL;

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

export async function createDrizzle(connectionString: string) {
  // const client = await createClient(connectionString);
  const pool = await createPool(connectionString);
  const db = drizzle(pool, { schema });

  return { pool, db };
}
export type Drizzle = Awaited<ReturnType<typeof createDrizzle>>["db"];

export * from "drizzle-orm";
export * from "./schema";
