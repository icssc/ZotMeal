import axios from "axios";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { MenuPeriod } from '@acme/db';
import {z} from "zod";

// https://uci.campusdish.com/api/menu/GetMenus?locationId=3314&periodId=49&date=1/19/2024
const GetMenuSchema = z.object({
  date: z.string().regex(RegExp("/^\d{2}\/\d{2}\/\d{4}$/")),
  period: z.nativeEnum(MenuPeriod)
  location: z.nativeEnum(Location)
})


const getMenuProcedure = publicProcedure 
  .input(GetMenuSchema)
  .query(({ ctx }) => {
    const _ = ctx;
    // get a menu

    const {date, period, }

    const {db} = ctx;

    // date
    // 

    db.menu.findUnique({where: {


      
    }})

    // get it from prisma
    // if not there, call parse procedure
})





export const menuRouter = createTRPCRouter({
  get: ,
  hello: publicProcedure.query(async ({ ctx }) => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
    console.log(res.data);
    console.log("hello");
    const _ = ctx;
    return "hello";
  }),
});
