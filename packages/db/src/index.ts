import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { schema } from "./schema";

//const connectionString = process.env.DATABASE_URL;
const connectionString = "postgresql://amho2:SntoV9YAwHa3@ep-dawn-rice-a6xmgw4o.us-west-2.aws.neon.tech/zotmeal?sslmode=require"

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

export const client = new pg.Client({ connectionString });

async function connect_db() {
  await client.connect();
}

connect_db()

export const db = drizzle(client, { schema });
export type Drizzle = typeof db;
