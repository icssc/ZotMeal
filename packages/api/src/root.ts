import { menuRouter } from "./router/menu";
import { restaurantRouter } from "./router/restaurant";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  menu: menuRouter,
  restaurant: restaurantRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
