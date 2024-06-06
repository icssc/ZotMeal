import { addDays } from "date-fns";

import type { Drizzle } from "@zotmeal/db";
import { RestaurantName } from "@zotmeal/utils";

import { logger } from "../../../logger";
import { scrapeAndUpsertEvents } from "../scrapeEvents";
import { updateDaily } from "../updateDaily";

const NUM_DAYS_UPDATE = 14;

export async function getWeekInfo(
  db: Drizzle,
  date: Date,
  restaurant: RestaurantName,
): Promise<void> {
  await scrapeAndUpsertEvents(db);

  // Update menus for each day
  const results = await Promise.allSettled(
    Array.from({ length: NUM_DAYS_UPDATE }).map((_, i) =>
      updateDaily(db, addDays(date, i), restaurant),
    ),
  );

  // log errors from the promises
  results.forEach((result, i) => {
    if (result.status === "rejected")
      logger.error(`Error updating day ${i + 1}:`, result.reason);
  });
}
