import { PostgreSqlContainer } from "@testcontainers/postgresql";

import { migrateSchema } from "@zotmeal/db";

// Set up postgres container for tests
export default async function () {
  const container = await new PostgreSqlContainer().start();

  // set DB_URL since container uri is different every time
  process.env.DB_URL = container.getConnectionUri();

  // send local migration to container
  await migrateSchema(process.env.DB_URL);
}
