import { format } from "date-fns";
import { z } from "zod";

import type { Drizzle } from "@zotmeal/db";
import { RestaurantSchema } from "@zotmeal/db";
import { DateRegex } from "@zotmeal/validators";
import { scrapeCampusDishEvents } from "../events";

import type { UpdateDailyParams } from "./updateDaily";
import { logger } from "../../logger";
import { updateDaily } from "./updateDaily";

export const GetWeekInfoSchema = z.object({
  date: DateRegex,
  restaurant: RestaurantSchema.shape.name,
});
export type GetWeekInfoParams = z.infer<typeof GetWeekInfoSchema>;

const NUM_DAYS_UPDATE = 14;

export async function getWeekInfo(
  db: Drizzle,
  params: GetWeekInfoParams,
): Promise<void> {
  const { date: dateString, restaurant } = params;
  const startDate = new Date(dateString);

  // Scrape and insert new events into db
  const eventResults = await scrapeCampusDishEvents(db)

  // Update menus for each day
  const results = await Promise.allSettled(
    Array.from({ length: NUM_DAYS_UPDATE }).map((_, i) => {
      const insertDate = new Date();
      insertDate.setDate(startDate.getDate() + i);
      const formattedDate = format(insertDate, "MM/dd/yyyy");

      const dailyParams = {
        date: formattedDate,
        restaurant,
      } satisfies UpdateDailyParams;

      return updateDaily(db, dailyParams);
    }),
  );

  // log errors from the promises
  results.forEach((result, i) => {
    if (result.status === "rejected") {
      logger.error(`Error updating day ${i + 1}:`, result.reason);
    }
  });
}
