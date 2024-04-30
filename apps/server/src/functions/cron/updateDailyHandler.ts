import fs from "fs";
import path from "path";
import { format } from "date-fns";

import {
  updateDaily,
  UpdateDailyParams,
} from "@zotmeal/api/src/services/updateDaily";
import { createDrizzle, pool } from "@zotmeal/db";
import { RESTAURANT_TO_ID } from "@zotmeal/utils";

import { env } from "../env";

// process.env.NODE_ENV
// const connectionString =
//   process.env.DATABASE_URL ?? "postgres://admin:admin@localhost:5434/zotmeal";

const certificate = fs.readFileSync(
  path.join(__dirname, "../../../../../certs", "global-bundle.pem"),
);
const connectionString = env.DATABASE_URL;
export const main = async (_event, _context) => {
  try {
    const db = createDrizzle({
      connectionString,
      ssl: {
        ca: certificate,
      },
    });
    const now = new Date();
    const formattedTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    console.log(`Start update daily job at ${formattedTime}`);

    const date = format(now, "MM/dd/yyyy");

    await Promise.allSettled(
      Object.keys(RESTAURANT_TO_ID).map((restaurantName) =>
        updateDaily(db, {
          date,
          restaurantName,
        } satisfies UpdateDailyParams),
      ),
    );

    console.log("Finished update daily job.");
  } catch (error) {
    console.error("Failed to execute weekly task", error);
  } finally {
    console.log("Closing connection pool...");
    await pool({ connectionString }).end();
    console.log("Closed connection pool.");
  }
};
