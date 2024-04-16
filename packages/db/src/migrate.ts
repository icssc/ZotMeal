import { migrate } from "drizzle-orm/node-postgres/migrator";

import { createClient, createDrizzle } from ".";

const databaseUrl =
  process.env.DATABASE_URL || "postgresql://admin:admin@localhost:5434/zotmeal"; // Ensure that the value is not undefined

const db = await createDrizzle(databaseUrl);

const client = await createClient(databaseUrl);

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: "migrations" });
// Don't forget to close the connection, otherwise the script will hang
await client.end();
