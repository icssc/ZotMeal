import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

console.log("drizzle.config.ts: DATABASE_URL:", process.env.DATABASE_URL);

export default defineConfig({
  dialect: "postgresql",
  out: "./migrations",
  schema: "./src/schema",
  dbCredentials: { url: process.env.DATABASE_URL, ssl: false },
  verbose: !process.env.CI,
});
