import fs from "fs";
import path from "path";
import { format } from "date-fns";

import {
  getWeekInfo,
  GetWeekInfoParams,
} from "@zotmeal/api/src/services/getWeekInfo";
import { createDrizzle, pool } from "@zotmeal/db";
import { Restaurant } from "@zotmeal/db/src/schema";
import { RESTAURANT_TO_ID } from "@zotmeal/utils";

import { env } from "../env";

// const connectionString =
//   process.env.DATABASE_URL ?? "postgres://admin:admin@localhost:5434/zotmeal";

const isProduction = process.env.NODE_ENV === "production";
const connectionString = env.DATABASE_URL;
const sslConfig = isProduction
  ? {
      rejectUnauthorized: false,
      ca: fs.readFileSync(
        path.join(__dirname, "certs", "global-bundle.pem"), // deployment structure is diff
      ),
    }
  : null;
export const main = async (_event, _context) => {
  try {
    const db = createDrizzle({
      connectionString,
      ssl: sslConfig,
    });
    const now = new Date();
    const formattedTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    console.log(`Weekly task executed at: ${formattedTime}`);

    const formattedDate = format(now, "MM/dd/yyyy");
    for (const restaurant of Object.keys(RESTAURANT_TO_ID)) {
      await getWeekInfo(db, {
        date: formattedDate,
        restaurantName: restaurant as Restaurant["name"],
      } satisfies GetWeekInfoParams);
    }
  } catch (error) {
    console.error("Failed to execute weekly task", error);
  } finally {
    await pool({ connectionString }).end();
  }
};
