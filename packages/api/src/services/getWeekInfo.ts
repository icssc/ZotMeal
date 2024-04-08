import { format } from "date-fns";
import { z } from "zod";

import type { Drizzle } from "@zotmeal/db";
import { DateRegex } from "@zotmeal/validators";
import { RestaurantSchema } from "@zotmeal/db/src/schema";

import { updateDaily } from "./updateDaily";

export const GetWeekInfoSchema = z.object({
  date: DateRegex,
  restaurantName: RestaurantSchema.shape.name
});
export type GetWeekInfoParams = z.infer<typeof GetWeekInfoSchema>;

const NUM_DAYS_UPDATE = 7;

export async function getWeekInfo(
  db: Drizzle,
  params: GetWeekInfoParams
): Promise<void> {
  const {
    date: dateString,
    restaurantName: restaurantName
  } = params;
  const startDate = new Date(dateString);

  for (let i = 0; i < NUM_DAYS_UPDATE; ++i) {
    const insertDate = new Date();
    insertDate.setDate(startDate.getDate() + i);
    const formattedDate = format(insertDate, "MM/dd/yyyy");

    const dailyParams = {
      date: formattedDate,
      restaurantName: restaurantName
    }

    try {
      await updateDaily(db, dailyParams)
    } catch (e) {
      console.error('Error for batch insert with params: %j\n', dailyParams, e)
    }
  }
}