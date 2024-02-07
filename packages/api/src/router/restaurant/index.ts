import { createTRPCRouter } from "../../trpc";
import { getScheduleProcedure } from "./getSchedule";

export const restaurantRouter = createTRPCRouter({
  getSchedule: getScheduleProcedure,
});
