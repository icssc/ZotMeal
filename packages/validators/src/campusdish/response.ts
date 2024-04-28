import { z } from "zod";

import { ID_TO_PERIOD, ID_TO_RESTAURANT } from "@zotmeal/utils";

import { MenuProductSchema, MenuStationSchema } from "./models";

const restaurantIds = Object.keys(ID_TO_RESTAURANT) as [
  keyof typeof ID_TO_RESTAURANT,
];

const periodIds = Object.keys(ID_TO_PERIOD) as [keyof typeof ID_TO_PERIOD];

export const CampusDishResponseSchema = z.object({
  LocationId: z.enum(restaurantIds),
  SelectedPeriodId: z.enum(periodIds),
  Menu: z.object({
    MenuId: z.string().min(1),
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
