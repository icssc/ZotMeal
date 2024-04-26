import type { Config } from "drizzle-kit";

export default {
  driver: "pg",
  out: "./migrations",
  schema: "./src/schema",
  dbCredentials: { connectionString: process.env.DATABASE_URL! },
  verbose: true,
  strict: false,
} satisfies Config;
