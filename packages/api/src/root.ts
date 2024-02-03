import { menuRouter } from "./router/menu";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  menu: menuRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
