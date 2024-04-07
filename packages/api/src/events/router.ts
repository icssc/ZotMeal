import { createTRPCRouter } from "../trpc";
import { getEvents } from "./procedures/getEvents";

export const eventRouter = createTRPCRouter({
  get: getEvents,
});
