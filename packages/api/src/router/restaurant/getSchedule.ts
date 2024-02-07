import { parse } from "date-fns";
import { publicProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { z, ZodError } from "zod";

import { MenuPeriod, RestaurantName } from "@zotmeal/db";
import { PERIOD_TO_ID, RESTAURANT_TO_ID } from "@zotmeal/utils";
import { PeriodSchedulesSchema } from "@zotmeal/validators";

export const GetScheduleSchema = z.object({
  date: z
    .string()
    .regex(
      RegExp(
        "^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{2})*$",
      ),
    ),
  period: z.nativeEnum(MenuPeriod).nullable(),
  restaurant: z.nativeEnum(RestaurantName),
});

// Get a list of schedules for:
//  - all periods if none are specified
//  - one period, if specified
export const getScheduleProcedure = publicProcedure
    .input(GetScheduleSchema)
    .query(async ({ ctx, input }) => {
        const { date: dateString, period: period, restaurant: restaurantName } = input;
        const { db } = ctx;
        const restaurantId = RESTAURANT_TO_ID[restaurantName as keyof typeof RESTAURANT_TO_ID];
        const date = parse(dateString, "MM/dd/yyyy", new Date());
        if (!date) {
            throw new TRPCError({
                message: `invalid date string ${dateString}`,
                code: "BAD_REQUEST",
            });
        }

        const periodSchedules: object[] = new Array();
        const periodsToGet: MenuPeriod[] = period !== null 
                                            ? [period]
                                            : Object.values(MenuPeriod);
        for (const period in periodsToGet) {
            const periodSchedule = await db.menu.findFirst({
                where: {
                    restaurantId: restaurantId,
                    date: date,
                    period: period
                },
                select: {
                    start: true,
                    end: true,
                },
            });

            periodSchedules.push({
                id: PERIOD_TO_ID[period as keyof typeof PERIOD_TO_ID],
                name : period,
                start: periodSchedule.start,
                end: periodSchedule.end
            })
        }

        try {
            return PeriodSchedulesSchema.parse({
                schedules: periodSchedules
            });
        } catch (e) {
            if (e instanceof ZodError) {
                console.log(e.issues);
            }
            throw e;
        }
    });
