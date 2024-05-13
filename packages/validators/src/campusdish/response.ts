import { z } from "zod";

import {
  capitalizedPeriodNames,
  periodIds,
  restaurantIds,
} from "@zotmeal/utils";

import { MenuProductSchema, MenuStationSchema } from "./models";

export const CampusDishResponseSchema = z.object({
  LocationId: z.enum(restaurantIds),
  SelectedPeriodId: z.enum(periodIds),
  Menu: z.object({
    MenuId: z.string().min(1),
    MenuPeriods: z.array(
      z.object({
        PeriodId: z.enum(periodIds),
        Name: z.enum(capitalizedPeriodNames),
        UtcMealPeriodStartTime: z.string().min(1),
        UtcMealPeriodEndTime: z.string().min(1),
      }),
    ),
    MenuProducts: z.array(MenuProductSchema),
    MenuStations: z.array(MenuStationSchema),
  }),
});

export type CampusDishResponse = z.infer<typeof CampusDishResponseSchema>;
