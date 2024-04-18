import { z } from "zod";

import type { Drizzle } from "@zotmeal/db";
import { RestaurantSchema } from "@zotmeal/db/src/schema";
import { DateRegex } from "@zotmeal/validators";

import { getCampusDish, parseCampusDish } from "..";
import { PERIOD_TO_ID } from "@zotmeal/utils";

export const UpdateDailySchema = z.object({
  date: DateRegex,
  restaurantName: RestaurantSchema.shape.name
});
export type UpdateDailyParams = z.infer<typeof UpdateDailySchema>;

export async function updateDaily(
  db: Drizzle,
  params: UpdateDailyParams
): Promise<void> {
  for (const period of Object.keys(PERIOD_TO_ID)) {
    const campusDishParams = {
      date: params.date,
      period: period,
      restaurant: params.restaurantName
    }

    const campusDishResponse = await getCampusDish(campusDishParams);
    if (!campusDishResponse) {
      continue;
    }
    await parseCampusDish(db, campusDishResponse);
  }
}