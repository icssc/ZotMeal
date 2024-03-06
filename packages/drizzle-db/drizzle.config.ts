import { resolve } from "path";
// import { URL } from "url";
import type { Config } from "drizzle-kit";

export default {
  driver: "pg",
  out: "./migrations",
  schema: [resolve(__dirname, "./src/schema")],
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? "",
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config;
