import { z } from "zod";

import type { Drizzle } from "@zotmeal/db";
import { MenuPeriodSchema, RestaurantSchema } from "@zotmeal/db/src/schema";
import { DateRegex } from "@zotmeal/validators";

import { getCampusDish, parseCampusDish } from "..";

export const UpdateDailySchema = z.object({
  date: DateRegex,
  restaurantName: RestaurantSchema.shape.name
});
export type UpdateDailyParams = z.infer<typeof UpdateDailySchema>;

export async function updateDaily(
  db: Drizzle,
  params: UpdateDailyParams
): Promise<void> {
  for (const period in MenuPeriodSchema.shape.name.Enum) {
    const campusDishParams = {
      date: params.date,
      periodName: period,
      restarauntName: params.restaurantName
    }

    const campusDishResponse = await getCampusDish(campusDishParams);
    if (!campusDishResponse) {
      throw new Error(`Null response from Campus Dish with params: ${campusDishParams}`);
    }
    await parseCampusDish(db, campusDishResponse);
  }
}