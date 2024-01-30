import axios from "axios";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const menuRouter = createTRPCRouter({
  hello: publicProcedure.query(({ ctx }) => {
    console.log("hello");
    const _ = ctx;
    return "hello";
  }),
});
