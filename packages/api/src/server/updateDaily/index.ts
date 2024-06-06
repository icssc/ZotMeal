import type { Drizzle } from "@zotmeal/db";
import { periodNames, RestaurantName } from "@zotmeal/utils";

import { logger } from "../../../logger";
import { getCampusDish, parseCampusDish } from "./parse";

export async function updateDaily(
  db: Drizzle,
  date: Date,
  restaurant: RestaurantName,
): Promise<void> {
  logger.info(
    `Updating ${restaurant} menu for (${date.toLocaleDateString()})...`,
  );

  // Get menu for each period
  await Promise.allSettled(
    periodNames.map(async (period) =>
      getCampusDish(date, period, restaurant).then((response) =>
        parseCampusDish(db, response),
      ),
    ),
  );

  logger.info(
    `✅ Updated ${restaurant} menu for (${date.toLocaleDateString()}).`,
  );
}
