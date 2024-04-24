import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL ?? "postgres://admin:admin@localhost:5434/zotmeal";
const sql = postgres(connectionString, { max: 1 });

const db = drizzle(sql);
await migrate(db, { migrationsFolder: "migrations" });
await sql.end();
