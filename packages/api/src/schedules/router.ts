import { createTRPCRouter } from "../trpc";
import { getScheduleProcedure } from "./procedures/getSchedule";

export const scheduleRouter = createTRPCRouter({
  get: getScheduleProcedure,
});
