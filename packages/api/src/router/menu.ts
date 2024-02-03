import axios from "axios";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { parse } from "@zotmeal/api";
import { CampusDishResponseSchema, ParsedResponseSchema } from "@zotmeal/validators";
import { z } from "zod";

export const menuRouter = createTRPCRouter({
  hello: publicProcedure.query(async ({ ctx }) => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
    console.log(res.data);
    console.log("hello");
    const _ = ctx;
    return "hello";
  }),
  parse: publicProcedure.query(async ({ ctx }) => {
    const res = await axios.get("https://uci.campusdish.com/api/menu/GetMenus?locationId=3314&periodId=49&date=1/19/2024");
    try {
      const validated = CampusDishResponseSchema.parse(res.data);
      const parsed = ParsedResponseSchema.parse(parse(validated));
      const _ = ctx;
      return parsed;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.issues);
      }
      throw error;
    }
  }),
});
