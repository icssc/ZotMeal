import { z } from "zod";

export const MenuStationSchema = z.object({
  StationId: z.string().min(1),
  Name: z.string().min(1),
});

export const MenuProductSchema = z.object({
  ProductId: z.string().min(1),
  StationId: z.string().min(1),
  Product: z.object({
    MarketingName: z.string().min(1),
    Categories: z.array(z.object({ DisplayName: z.string().min(1) })).min(1),
    ShortDescription: z.string(),
    DietaryInformation: z.array(
      z.object({
        IconUrl: z.string(),
        Name: z.string(), 
        isEnabled: z.boolean() 
      })
    ), 
    // Dietary Restrictions
    AvailableFilters: z.object({
      ContainsEggs: z.boolean().nullable(),
      ContainsFish: z.boolean().nullable(),
      ContainsMilk: z.boolean().nullable(),
      ContainsPeanuts: z.boolean().nullable(),
      ContainsSesame: z.boolean().nullable(),
      ContainsShellfish: z.boolean().nullable(),
      ContainsSoy: z.boolean().nullable(),
      ContainsTreeNuts: z.boolean().nullable(),
      ContainsWheat: z.boolean().nullable(),
    }),
    // Nutrition Info object
    NutritionalTree: z.array(
      z.object({
        Name: z.string(),
        Value: z.string().nullable(),
        Unit: z.string().nullable(),
        SubList: z.array(
          z.object({
            Name: z.string(),
            Value: z.string(),
            Unit: z.string().nullable()
          })
        ) 
      }),
    ),
    ServingSize: z.string().nullable(),
    ServingUnit: z.string().nullable(),
    Calories: z.string().nullable(),
  }),
});


/* Represents the response returned from the GetMenuPeriods query. */
export const PeriodSchema = z.object({
  Time: z.string().datetime(),  // Time of request
  Result: z.array(
    z.object({
      PeriodId: z.number(),
      PeriodName: z.string(),
      UtcMealPeriodStartTime: z.string().datetime(),
      UtcMealPeriodEndTime: z.string().datetime()
    })
  )
});

export type CampusDishMenuProduct = z.infer<typeof MenuProductSchema>;
export type CampusDishPeriodResult = z.infer<typeof PeriodSchema>;