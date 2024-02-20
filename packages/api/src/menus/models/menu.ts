import { z } from "zod";

import type { Prisma } from "@zotmeal/db";
import { MenuPeriod, RestaurantName } from "@zotmeal/db";
import { DateRegex, StationSchema } from "@zotmeal/validators";

import { RestaurantSchema } from "../../restaurants/models";

export type MenuResponse = Prisma.MenuGetPayload<{
  include: {
    stations: {
      include: {
        dishes: true;
      };
    };
    restaurant: true;
  };
}>;

export const MenuSchema = z.object({
  id: z.string(),
  period: z.nativeEnum(MenuPeriod),
  date: DateRegex,
  start: z.string().datetime(),
  end: z.string().datetime(),
  restaurant: RestaurantSchema,
  stations: z.array(StationSchema),
});

// Used for Create and Update operations
export type MenuParams = z.infer<typeof MenuSchema>;

export const GetMenuSchema = z.object({
  date: DateRegex,
  period: z.nativeEnum(MenuPeriod),
  restaurant: z.nativeEnum(RestaurantName),
});

export type GetMenuParams = z.infer<typeof GetMenuSchema>;
