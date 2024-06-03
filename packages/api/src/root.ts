import { dishRouter } from "./dishes/router";
import { eventRouter } from "./events/router";
import { menuRouter } from "./menus/router";
import { notificationRouter } from "./notifications/router";
import { scheduleRouter } from "./schedules/router";
import { createTRPCRouter, publicProcedure } from "./trpc";
import { userRouter } from "./users/router";

export const appRouter = createTRPCRouter({
  event: eventRouter,
  dish: dishRouter,
  menu: menuRouter,
  notification: notificationRouter,
  schedule: scheduleRouter,
  user: userRouter,
  hello: publicProcedure.query(() => "Hello, world!"),
});

// export type definition of API
export type AppRouter = typeof appRouter;
