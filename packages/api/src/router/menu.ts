import axios from "axios";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { parse } from "../../../utils/parse";
import { CampusDishResponseSchema, ParsedResponseSchema } from "@acme/validators";

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
    const validated = CampusDishResponseSchema.parse(res.data);
    const parsed = ParsedResponseSchema.parse(parse(validated));
    const _ = ctx;
    return parsed;
  }),
});
