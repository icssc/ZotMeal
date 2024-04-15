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

export type Drizzle = ReturnType<typeof drizzle>;
export const createDrizzle = async (
  connectionString: string,
): Promise<Drizzle> => {
  const client = await createClient(connectionString);
  const db = drizzle(client, { schema });

  return db;
};

export * from "drizzle-orm";
