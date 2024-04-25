import type { Config } from "drizzle-kit";

export default {
  driver: "pg",
  schema: "../db/src/schema",
  dbCredentials: {
    connectionString: process.env.DB_URL!,
  },
} satisfies Config;
