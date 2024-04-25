import { TRPCError } from "@trpc/server";

import { publicProcedure } from "../../trpc";
import { getSchedule, GetScheduleSchema } from "../services/schedule";

export const getScheduleProcedure = publicProcedure
  .input(GetScheduleSchema)
  .query(async ({ ctx: { db }, input }) => {
    const schedule = await getSchedule(db, input);

    if (!schedule) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "schedule not found",
      });
    }
    return schedule;
  });
