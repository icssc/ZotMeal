import { z } from "zod";

import type { Drizzle, Period } from "@zotmeal/db";
import { PeriodEnum, RestaurantSchema } from "@zotmeal/db";
import { DateRegex } from "@zotmeal/validators";

import type { GetMenuParams } from "..";
import { getCampusDish, parseCampusDish } from "..";
import { logger } from "../../logger";

export const UpdateDailySchema = z.object({
  date: DateRegex,
  restaurantName: RestaurantSchema.shape.name,
});
export type UpdateDailyParams = z.infer<typeof UpdateDailySchema>;

export async function updateDaily(
  db: Drizzle,
  params: UpdateDailyParams,
): Promise<void> {
  try {
    logger.info(
      `Updating ${params.restaurantName} menu for (${params.date})...`,
    );

    const { date, restaurantName } = UpdateDailySchema.parse(params);

    // Get menu for each period
    await Promise.allSettled(
      (Object.keys(PeriodEnum.enumValues) as Period[]).map(async (period) => {
        const campusDishParams = {
          date,
          period,
          restaurant: restaurantName,
        } satisfies GetMenuParams;

        // TODO: handle null response
        return getCampusDish(campusDishParams).then((campusDishResponse) => {
          if (!campusDishResponse) return;
          return parseCampusDish(db, campusDishResponse);
        });
      }),
    );
    logger.info(
      `✅ Updated ${params.restaurantName} menu for (${params.date}).`,
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error(err.issues);
    }
    console.error(err);
    throw err;
  }
}
