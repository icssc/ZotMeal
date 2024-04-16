// import { resolve } from "path";
// import { URL } from "url";
import type { Config } from "drizzle-kit";

export default {
  driver: "pg",
  out: "./migrations",
  // schema: [resolve(__dirname, "./src/schema")],
  schema: "./src/schema",
  dbCredentials: {
    connectionString:
      process.env.DATABASE_URL ??
      "postgres://admin:admin@localhost:5434/zotmeal",
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config;
