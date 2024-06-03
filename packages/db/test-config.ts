import { defineConfig } from "drizzle-kit";

if (!process.env.DB_URL) throw new Error("DB_URL is not set");

export default defineConfig({
  dialect: "postgresql",
  schema: "../db/src/schema",
  dbCredentials: { url: process.env.DB_URL },
});
