import axios from "axios";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { MenuPeriod } from '@acme/db';
import {z} from "zod";

// https://uci.campusdish.com/api/menu/GetMenus?locationId=3314&periodId=49&date=1/19/2024

// const locations = Object.values(LocationNames).map((name) => name.toString());

// enum RestaurantName {
//   brandywine,
//   anteatery
// }

// const locations = ["a", "b", "c"] as const;


const GetMenuSchema = z.object({
  date: z.string().regex(RegExp("/^\d{2}\/\d{2}\/\d{4}$/")),
  period: z.nativeEnum(MenuPeriod),
  restaurant: z.string()
})


const getMenuProcedure = publicProcedure 
  .input(GetMenuSchema)
  .query(({ ctx, input }) => {
    const _ = ctx;
    // get a menu

    const {date, period, restaurant} = input;

    const {db} = ctx;

    // date

    const restaurantModel = db.restaurant.findFirst({
      where: {
        name: restaurant
      },
      include: {
        stations: false,
        menu: false,
      }
    });
    if (restaurantModel === null) {
      return 
      
    }



    // get the rstaurant with this name



    db.menu.findUnique({where: {
      date: date,
      period: period,
      restaurant: location
    }})

    // get it from prisma
    // if not there, call parse procedure
})




import { parse } from "../../../utils/parse";
import { CampusDishResponseSchema, ParsedResponseSchema } from "@acme/validators";

export const menuRouter = createTRPCRouter({
  get: ,
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
