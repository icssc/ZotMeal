import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { z } from "zod";

import type { Drizzle } from "@zotmeal/db";
import type { PeriodName } from "@zotmeal/utils";
import { RestaurantSchema } from "@zotmeal/db";
import { getRestaurantId } from "@zotmeal/utils";
import { DateRegex } from "@zotmeal/validators";

export const GetScheduleSchema = z.object({
  date: DateRegex,
  restaurant: RestaurantSchema.shape.name,
});

export type GetScheduleParams = z.infer<typeof GetScheduleSchema>;

// TODO: might be more robust to do a type intersection depending on if its a weekday or weekend
// since brunch is only on weekends, etc.
type ScheduleResult = Partial<
  Record<PeriodName, { start: string; end: string; price: string }>
>;

export async function getSchedule(
  db: Drizzle,
  params: GetScheduleParams,
): Promise<ScheduleResult | null> {
  const parsedParams = GetScheduleSchema.safeParse(params);

  if (!parsedParams.success) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `invalid params: ${parsedParams.error.message}`,
    });
  }

  const { date, restaurant } = parsedParams.data;

  const restaurantId = getRestaurantId(restaurant);
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
