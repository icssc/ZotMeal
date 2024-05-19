import { eventRouter } from "./events/router";
import { menuRouter } from "./menus";
import { notificationRouter } from "./notifications/router";
import { scheduleRouter } from "./schedules/router";
import { createTRPCRouter, publicProcedure } from "./trpc";

export const appRouter = createTRPCRouter({
  menu: menuRouter,
  event: eventRouter,
  notification: notificationRouter,
  schedule: scheduleRouter,
  hello: publicProcedure.query(() => "Hello, world!"),
});

// export type definition of API
export type AppRouter = typeof appRouter;
