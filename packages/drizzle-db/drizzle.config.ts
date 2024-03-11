import type { Config } from "drizzle-kit";

export default {
  driver: "pg",
  out: "./migrations",
  schema: "./src/drizzle/schema.ts",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? "",
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config;
