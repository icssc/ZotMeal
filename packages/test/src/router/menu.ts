import axios from "axios";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const menuRouter = createTRPCRouter({
  hello: publicProcedure.query(async ({ ctx }) => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
    console.log(res.data);
    console.log("hello");
    const _ = ctx;
    return "hello";
  }),
});
