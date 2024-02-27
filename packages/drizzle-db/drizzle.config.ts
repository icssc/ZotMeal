import { resolve } from "path";
import { URL } from "url";
import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../../.env") });


export default {
  driver: "pg",
  out: "./src/drizzle",
  schema: [resolve(__dirname, "./src/drizzle/schema.ts")],
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? "",
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config;
