import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { schema } from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

export const client = new pg.Client({ connectionString });

await client.connect();

export const db = drizzle(client, { schema });
export type Drizzle = typeof db;
