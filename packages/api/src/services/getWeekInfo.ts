import { format } from "date-fns";
import { z } from "zod";

import type { Prisma, PrismaClient, } from "@zotmeal/db";
import { getPeriodId, getRestaurantId, parseDate } from "@zotmeal/utils";
import { DateRegex } from "@zotmeal/validators";
import {RestaurantName, MenuPeriodName } from "@prisma/client";

import { getCampusDish } from "..";
import { batchInsert } from "./batchInsert";

export const GetWeekInfoSchema = z.object({
  date: DateRegex,
  numDays: z
    .number()
    .positive()
    .default(7),  // one week
  restaurant: z.nativeEnum(RestaurantName)
});

export type GetWeekInfoParams = z.infer<typeof GetWeekInfoSchema>;

export async function getWeekInfo(
  db: PrismaClient | Prisma.TransactionClient,
  params: GetWeekInfoParams): Promise<void> {
  const {
    date: dateString,
    numDays,
    restaurant: restaurantName
  } = params;

  // verify params
  const date = parseDate(dateString);
  if (!date) {
    console.error(`invalid date: ${dateString}`);
    throw new Error("InvalidDateError");
  }

  const restaurant = await getRestaurantId(restaurantName);
  if (!restaurant) {
    console.error(`restaurant not found: ${restaurantName}`);
    throw new Error("RestaurantNotFoundError");
  }
  
  // iter through dates
  const menus = [];
  for (let i = 0; i < numDays; ++i) {
    const insertDate = new Date();
    insertDate.setDate(date.getDate() + i);
    const formattedDate = format(insertDate, "MM/dd/yyyy");

    for (const period in MenuPeriodName) {
      const campusDishParams = {
        date: formattedDate,
        period: period,
        restaurant: restaurantName
      }
      const campusDishResponse = await getCampusDish(campusDishParams);
      if (!campusDishResponse) {
        console.error("failed to get campus dish response for:", campusDishParams);
        throw new Error("CampusDishResponseError");
      }

      if (campusDishResponse.SelectedPeriodId === getPeriodId(period)) {
        // matching periodIds indicates that the periodId does exist for that day
        menus.push(campusDishResponse);
      }
    }
  }
  batchInsert(db, menus);
}