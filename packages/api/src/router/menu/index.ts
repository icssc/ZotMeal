import axios from "axios";

import { createTRPCRouter, publicProcedure } from "../../trpc";
import { getMenuProcedure } from "./get";
import { parseMenuProcedure } from "./parse";

// import { createTRPCRouter, publicProcedure } from "../trpc";
// import { parseCampusDish } from "./parse";

const helloProcedure = publicProcedure.query(async (opts) => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
  const _ = opts;
  console.log(res.data);
  console.log("hello");
  return "hello";
});

export const menuRouter = createTRPCRouter({
  get: getMenuProcedure,
  hello: helloProcedure,
  parse: parseMenuProcedure,
  // parse: publicProcedure.query(async ({ ctx }) => {
  //   const res = await axios.get(
  //     "https://uci-campusdish-com.translate.goog/api/menu/GetMenus?locationId=3314&periodId=49&date=1/19/2024",
  //   );
  //   try {
  //     const validated = CampusDishResponseSchema.parse(res.data);
  //     const parsed = ParsedResponseSchema.parse(parseCampusDish(validated));
  //     const _ = ctx;
  //     return parsed;
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       console.log(error.issues);
  //     }
  //     throw error;
  //   }
  // }),
});
