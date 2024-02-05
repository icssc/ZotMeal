import { menuRouter } from "./router/menu";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  menu: menuRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
