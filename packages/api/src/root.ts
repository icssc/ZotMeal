import { menuRouter } from "./router/menu";
import { postRouter } from "./router/post";
import { parseRouter } from "./router/parse";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  menu: menuRouter,
  parse: parseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
