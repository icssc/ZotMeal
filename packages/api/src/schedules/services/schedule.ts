import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Drizzle, Period } from "@zotmeal/db";
import { parseDate, RESTAURANT_TO_ID } from "@zotmeal/utils";
import { DateRegex } from "@zotmeal/validators";

export interface GetScheduleParams {
  date: string;
  restaurantName: string;
}

export const GetScheduleSchema = z.object({
  date: DateRegex,
  restaurantName: z.string(),
}) satisfies z.ZodType<GetScheduleParams>;

// TODO: might be more robust to do a type intersection depending on if its a weekday or weekend
// since brunch is only on weekends, etc.
type ScheduleResult = Record<
  Period["name"],
  { start: string; end: string; price: string }
>;

export async function getSchedule(
  db: Drizzle,
  params: GetScheduleParams,
): Promise<ScheduleResult | null> {
  const date = parseDate(params.date);
  if (!date) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "invalid date format",
    });
  }
  const restaurantId =
    RESTAURANT_TO_ID[params.restaurantName]?.toString() ?? "";
  const fetchedPeriods = await db.query.MenuTable.findMany({
    where: (menu, { eq }) => eq(menu.restaurantId, restaurantId),
    columns: {
      start: true,
      end: true,
      period: true,
      price: true,
    },
  });

  const schedule: ScheduleResult = {};
  for (const Period of fetchedPeriods) {
    const { period, start, end, price } = Period;
    schedule[period] = { start, end, price };
  }
  return schedule;
}
