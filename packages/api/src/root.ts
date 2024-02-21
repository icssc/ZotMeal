import { menuRouter } from "./menus";
import { notificationRouter } from "./notifications/router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  menu: menuRouter,
  notification: notificationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
