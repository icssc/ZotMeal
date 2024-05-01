import axios from "axios";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { getMenuProcedure } from "./procedures/getMenu";

const helloProcedure = publicProcedure.query(async (opts) => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
  const _ = opts;
  console.log(res.data);
  return "menu -> hello";
});

export const menuRouter = createTRPCRouter({
  get: getMenuProcedure,
  hello: helloProcedure,
});
