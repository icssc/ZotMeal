import { upsertEvents } from "@api/events/services";
import { logger } from "@api/logger";
import { addDays, format } from "date-fns";

import type { Drizzle, RestaurantName } from "@zotmeal/db";

import { daily } from "../daily";
import { getHTML, scrapeEvents } from "../scrapeEvents";

const NUM_DAYS_UPDATE = 14;

export async function weekly(
  db: Drizzle,
  date: Date,
  restaurant: RestaurantName,
): Promise<void> {
  // scrape and upsert current events
  const html = await getHTML(
    "https://uci-campusdish-com.translate.goog/api/events?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp",
  );
  const events = await scrapeEvents(html);
  await upsertEvents(db, events);

  // Update menus for each day
  const results = await Promise.allSettled(
    Array.from({ length: NUM_DAYS_UPDATE }).map((_, i) =>
      daily(db, addDays(date, i), restaurant),
    ),
  );

  // log errors from the promises
  results.forEach((result, i) => {
    if (result.status === "rejected")
      logger.error(
        result,
        `weekly: Error updating day ${format(addDays(date, i), "yyyy-MM-dd")}:`,
      );
  });
}
