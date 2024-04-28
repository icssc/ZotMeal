import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { z } from "zod";

import type { Drizzle, Period } from "@zotmeal/db";
import { parseDate, RESTAURANT_TO_ID } from "@zotmeal/utils";
import { DateRegex } from "@zotmeal/validators";

export const GetScheduleSchema = z.object({
  date: DateRegex,
  restaurant: z.string(),
});

export type GetScheduleParams = z.infer<typeof GetScheduleSchema>;

// TODO: might be more robust to do a type intersection depending on if its a weekday or weekend
// since brunch is only on weekends, etc.
type ScheduleResult = Record<
  Period,
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
  const restaurantId = RESTAURANT_TO_ID[params.restaurant]?.toString() ?? "";
  const fetchedPeriods = await db.query.MenuTable.findMany({
    where: (menu, { eq }) =>
      eq(menu.restaurantId, restaurantId) &&
      eq(menu.date, format(date, "MM/dd/yyyy")),
    columns: {
      start: true,
      end: true,
      period: true,
      price: true,
    },
  });

  return Object.fromEntries(
    fetchedPeriods.map(({ period, ...data }) => [period, data]),
  ) as ScheduleResult;
}
