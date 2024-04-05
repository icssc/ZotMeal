import { z } from "zod";

import { ID_TO_RESTAURANT } from "@zotmeal/utils";

import { MenuProductSchema, MenuStationSchema } from "./models";

const [restaurantId, ...restaurantIds] = Object.keys(ID_TO_RESTAURANT) as (keyof typeof ID_TO_RESTAURANT)[];
export const CampusDishResponseSchema = z.object({
  LocationId: z.enum([restaurantId!, ...restaurantIds]),
  SelectedPeriodId: z.string().nullable(),
  Menu: z.object({
    MenuId: z.string(),
    MenuPeriods: z.array(
      z.object({
        PeriodId: z.string().min(1),
        Name: z.string().min(1),
        UtcMealPeriodStartTime: z.string().min(1),
        UtcMealPeriodEndTime: z.string().min(1),
      }),
    ),
    MenuProducts: z.array(MenuProductSchema),
    MenuStations: z.array(MenuStationSchema),
  }),
});

export type CampusDishResponse = z.infer<typeof CampusDishResponseSchema>;
