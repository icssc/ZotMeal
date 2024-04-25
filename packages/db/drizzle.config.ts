import type { Config } from "drizzle-kit";

export default {
  driver: "pg",
  out: "./migrations",
  schema: "./src/schema",
  dbCredentials: {
    connectionString:
      process.env.DATABASE_URL ??
      "postgres://admin:admin@localhost:5434/zotmeal",
  },
  verbose: true,
  strict: false,
} satisfies Config;
