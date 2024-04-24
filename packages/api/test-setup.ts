import { PostgreSqlContainer } from "@testcontainers/postgresql";

import { pushSchema } from "@zotmeal/db";

let teardownHappened = false;

// Set up postgres container for tests
export default async function () {
  const container = await new PostgreSqlContainer().start();

  process.env.DB_URL = container.getConnectionUri();

  await pushSchema(process.env.DB_URL);

  // return teardown function
  return async () => {
    if (teardownHappened) {
      throw new Error("teardown called twice");
    }
    teardownHappened = true;
    if (container) {
      await container.stop();
    }
  };
}
