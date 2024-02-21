import { z } from "zod";

// import type { Prisma } from "@zotmeal/db";
import { MenuPeriodName, RestaurantName } from "@zotmeal/db";
import { DateRegex } from "@zotmeal/validators";

import { RestaurantSchema } from "../../restaurants/models";
import { StationSchema } from "../../stations/models";

// export type MenuResponse = Prisma.MenuGetPayload<{
//   include: {
//     stations: {
//       include: {
//         dishes: true;
//       };
//     };
//     restaurant: true;
//   };
// }>;

export const MenuSchema = z.object({
  id: z.string(),
  periodId: z.string(),
  date: DateRegex,
  stations: z.array(StationSchema.pick({ id: true })),
  restaurant: RestaurantSchema.pick({ id: true }),
});

// Used for Create and Update operations
export type MenuParams = z.infer<typeof MenuSchema>;

export const GetMenuSchema = z.object({
  date: DateRegex,
  period: z.nativeEnum(MenuPeriodName),
  restaurant: z.nativeEnum(RestaurantName),
});

export type GetMenuParams = z.infer<typeof GetMenuSchema>;

export const MenuPeriodSchema = z.object({
  id: z.string(),
  name: z.nativeEnum(MenuPeriodName),
  start: z.string(),
  end: z.string(),
});

export type MenuPeriodParams = z.infer<typeof MenuPeriodSchema>;
