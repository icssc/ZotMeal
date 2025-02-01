import { upsertEvents } from "@api/events/services";
import { logger } from "@api/logger";
import { addDays, format } from "date-fns";

import type { Drizzle, RestaurantName } from "@zotmeal/db";
import { restaurantNames } from "@zotmeal/db";

import { daily } from "../daily";
import { getHTML, scrapeEvents } from "../scrapeEvents";

const NUM_DAYS_UPDATE = 14;

/**
 * Scrape and upsert events from CampusDish.
 * The endpoint contains events from both restaurants.
 */
export async function eventJob(db: Drizzle): Promise<void> {
  const html = await getHTML(
    "https://uci-campusdish-com.translate.goog/api/events?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp",
  );
  const events = await scrapeEvents(html);

  logger.info(`weekly: Upserting ${events.length} events...`);
  const upsertedEvents = await upsertEvents(db, events);
  logger.info(`weekly: Upserted ${upsertedEvents.length} events.`);
}

/**
 * Executes a {@link daily} job {@link NUM_DAYS_UPDATE} days out starting from the given date.
 */
export async function restaurantJob(
  db: Drizzle,
  date: Date,
  restaurant: RestaurantName,
): Promise<void> {
  await eventJob(db);

  const results = await Promise.allSettled(
    Array.from({ length: NUM_DAYS_UPDATE }).map((_, i) =>
      daily(db, addDays(date, i), restaurant),
    ),
  );

  // Log errors.
  results.forEach((result, i) => {
    if (result.status === "rejected")
      logger.error(
        result,
        `weekly: Error updating day ${format(addDays(date, i), "yyyy-MM-dd")}:`,
      );
  });
}

export async function weekly(db: Drizzle): Promise<void> {
  await eventJob(db);

  const results = await Promise.allSettled(
    restaurantNames.map(async (restaurant) =>
      restaurantJob(db, new Date(), restaurant),
    ),
  );

  // Log errors.
  results.forEach((result) => {
    if (result.status === "rejected")
      logger.error("weekly() failed:", result.reason);
  });
}
