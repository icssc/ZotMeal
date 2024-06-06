import { format } from "date-fns";

import type { Drizzle } from "@zotmeal/db";
import type { PeriodName, RestaurantName } from "@zotmeal/utils";
import { getRestaurantId } from "@zotmeal/utils";

// TODO: might be more robust to do a type intersection depending on if its a weekday or weekend
// since brunch is only on weekends, etc.
type ScheduleResult = Partial<
  Record<PeriodName, { start: string; end: string; price: string }>
>;

export async function getSchedule(
  db: Drizzle,
  date: Date,
  restaurant: RestaurantName,
): Promise<ScheduleResult> {
  const fetchedPeriods = await db.query.MenuTable.findMany({
    where: (menu, { eq, and }) =>
      and(
        eq(menu.restaurantId, getRestaurantId(restaurant)),
        eq(menu.date, format(date, "yyyy-MM-dd")),
      ),
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
