import { z } from "zod";

import type { Drizzle } from "@zotmeal/db";
import {
  MenuPeriod,
  MenuPeriodSchema,
  RestaurantSchema,
} from "@zotmeal/db/src/schema";
import { DateRegex } from "@zotmeal/validators";

import { getCampusDish, parseCampusDish } from "..";
import { GetMenuParams } from "../menus/services/parse";

export const UpdateDailySchema = z.object({
  date: DateRegex,
  restaurantName: RestaurantSchema.shape.name,
});
export type UpdateDailyParams = z.infer<typeof UpdateDailySchema>;

export async function updateDaily(
  db: Drizzle,
  params: UpdateDailyParams,
): Promise<void> {
  for (const period in MenuPeriodSchema.shape.name.Enum) {
    const campusDishParams = {
      date: params.date,
      period: period as MenuPeriod["name"],
      restaurant: params.restaurantName,
    } satisfies GetMenuParams;

    const campusDishResponse = await getCampusDish(campusDishParams);
    if (!campusDishResponse) {
      continue;
    }
    await parseCampusDish(db, campusDishResponse);
  }
}
