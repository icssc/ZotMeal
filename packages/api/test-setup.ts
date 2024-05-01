import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { Wait } from "testcontainers";

import { pool, pushSchema } from "@zotmeal/db";

import { logger } from "./logger";

let teardownHappened = false;

// Set up postgres container for tests
export default async function () {
  const container = await new PostgreSqlContainer()
    .withWaitStrategy(
      Wait.forLogMessage("database system is ready to accept connections"),
    )
    .start();

  process.env.DB_URL = container.getConnectionUri();

  logger.info(`postgres container started. DB_URL: ${process.env.DB_URL}`);

  await pushSchema(process.env.DB_URL);

  // teardown pool and container
  return async () => {
    if (teardownHappened) {
      throw new Error("teardown called twice");
    }
    teardownHappened = true;
    await pool({ connectionString: process.env.DB_URL }).end();
    await container.stop();
  };
}
