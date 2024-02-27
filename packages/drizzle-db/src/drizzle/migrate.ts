import { resolve } from "path";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http"; //import the drizzle that work for neon serverless driver
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: "../../.env" });

const DATABASE_URL = process.env.DATABASE_URL || "";

console.log(DATABASE_URL);
const sql = neon(DATABASE_URL); //estabilish connection to db
const db = drizzle(sql); //wrapping db connection with drizzle, this gave us actual query builder

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "migrations",
    });
    console.log("Migration successful");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
main();
