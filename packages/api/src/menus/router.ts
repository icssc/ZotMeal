import { createTRPCRouter, publicProcedure } from "../trpc";
import { getMenuProcedure } from "./procedures/getMenu";

const helloProcedure = publicProcedure.query(() => "menu -> hello");

export const menuRouter = createTRPCRouter({
  get: getMenuProcedure,
  hello: helloProcedure,
});
