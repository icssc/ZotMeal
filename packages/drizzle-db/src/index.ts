import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import { schema } from "./schema";

export const client = new Client({
  connectionString: process.env.DATABASE_URL!,
});

await client.connect();

export const db = drizzle(client, { schema });
export type Drizzle = typeof db;
