import { drizzle } from "drizzle-orm/postgres-js";
import { Client } from "pg";

import { schema } from "./schema";

const client = new Client({ connectionString: process.env.DATABASE_URL! });

await client.connect();

export const db = drizzle(client, { schema });
