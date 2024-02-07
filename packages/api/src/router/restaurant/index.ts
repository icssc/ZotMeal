import { createTRPCRouter } from "../../trpc";
import { getScheduleProcedure } from "./get";

export const restaurantRouter = createTRPCRouter({
  getSchedule: getScheduleProcedure,
});
