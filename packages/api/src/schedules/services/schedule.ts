import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Drizzle } from "@zotmeal/db";
import type { Menu } from "@zotmeal/db/src/schema";
import { MenuTable } from "@zotmeal/db/src/schema";
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

interface ScheduleResult {
  breakfast?: {
    start: string;
    end: string;
    price: string;
  };
  brunch?: {
    start: string;
    end: string;
    price: string;
  };
  lunch?: {
    start: string;
    end: string;
    price: string;
  };
  dinner?: {
    start: string;
    end: string;
    price: string;
  };
  latenight?: {
    start: string;
    end: string;
    price: string;
  };
}

export async function getSchedule(
  db: Drizzle,
  params: GetScheduleParams,
): Promise<ScheduleResult | null> {
  const date = parseDate(params.date);
  console.log(date);
  if (!date) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "invalid date format",
    });
  }
  const restaurantId =
    RESTAURANT_TO_ID[
      params.restaurantName as keyof typeof RESTAURANT_TO_ID
    ]?.toString() || "";
  const fetchedPeriods = await db.query.MenuTable.findMany({
    where: (menu, { eq }) => eq(menu.restaurantId, restaurantId),
    columns: {
      start: true,
      end: true,
      period: true,
      price: true,
    },
  });

  // conforms to the ScheduleResult type,but all object inside is optional (bc sometime they dont have brunch and latenight)
  const schedule: Partial<ScheduleResult> = {};
  for (const Period of fetchedPeriods) {
    const { period, start, end, price } = Period;
    schedule[period] = { start, end, price };
  }
  return schedule;
}
