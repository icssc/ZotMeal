import { z } from "zod";

import type { Drizzle } from "@zotmeal/db";
import { RestaurantSchema } from "@zotmeal/db";
import { periodNames } from "@zotmeal/utils";
import { DateRegex } from "@zotmeal/validators";

import type { GetMenuParams } from "../../menus/services";
import { logger } from "../../../logger";
import { getCampusDish, parseCampusDish } from "./parse";

export const UpdateDailySchema = z.object({
  date: DateRegex,
  restaurant: RestaurantSchema.shape.name,
});
export type UpdateDailyParams = z.infer<typeof UpdateDailySchema>;

export async function updateDaily(
  db: Drizzle,
  params: UpdateDailyParams,
): Promise<void> {
  try {
    logger.info(`Updating ${params.restaurant} menu for (${params.date})...`);

    const { date, restaurant } = UpdateDailySchema.parse(params);

    // Get menu for each period
    await Promise.allSettled(
      periodNames.map(async (period) => {
        const campusDishParams = {
          date,
          period,
          restaurant,
        } satisfies GetMenuParams;

        // TODO: handle null response
        return getCampusDish(campusDishParams).then((campusDishResponse) => {
          if (!campusDishResponse) return;
          return parseCampusDish(db, campusDishResponse);
        });
      }),
    );
    logger.info(`✅ Updated ${params.restaurant} menu for (${params.date}).`);
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error(err.issues);
    }
    console.error(err);
    throw err;
  }
}
