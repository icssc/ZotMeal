import { z } from "zod";

/* Represents the schema of the return data from query AEM_eventList */
export const AEMEventListSchema = z.array(
  z.object({
    title: z.string().min(1),
    subtitle: z.string().min(1),
    description: z.object({
      markdown: z.string().min(1)
    }),
    startDate: z.string().date(),
    endDate: z.string().date().nullable(),
    startTime: z.string().time(),
    endTime: z.string().time().nullable(),
  })
);

/* Represents the schema of the return data from query getLocationRecipes */
export const GetLocationRecipesSchema = z.object({
  locationRecipesMap: z.object({
    stationSkuMap: z.array(
      z.object({
        id: z.number(),
        skus: z.array(z.string()).nonempty()
      })
    )
  }),
  products: z.object({
    items: z.array(
      z.object({
        productView: z.object({
          sku: z.string(),
          name: z.string(),
          images: z.array(
            z.object({
              label: z.string(),
              roles: z.array(z.string()),
              url: z.string()
            })
          ),
          attributes: z.array(
            z.object({
              name: z.string(),
              value: z.string()
            })
          )
        })
      })
    )
  })
});

export const GetLocationSchema = z.object({
  Commerce_mealPeriods: z.array(
    z.object({
      name: z.string(),
      id: z.number(),
      position: z.number(),
    })
  ),
  Commerce_attributesList: z.object({
    items: z.array(
      z.object({
        code: z.string(),
        options: z.array(
          z.object({
            value: z.string(),
            label: z.string(),
          })
        )
      })
    )
  }),
  getLocation: z.object({
    commerceAttributes: z.object({
      maxMenusDate: z.date(),
      children: z.array(
        z.object({
          uid: z.string(),
          name: z.string(),
          position: z.number()
        })
      )
    }),
    aemAttributes: z.object({
      hoursOfOperation: z.object({
        schedule: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            type: z.string(),
            meal_periods: z.array(
              z.object({
                meal_period: z.string(),
                opening_hours: z.string(),
              })
            ),
            start_date: z.string().date(),
            end_date: z.string().date(),
          })
        )
      })
    })
  })
})

export type EventList = z.infer<typeof AEMEventListSchema>;
export type LocationRecipes = z.infer<typeof GetLocationRecipesSchema>;
export type LocationInfo = z.infer<typeof GetLocationSchema>;
export type MealPeriod = LocationInfo["Commerce_mealPeriods"][0]

// Indexed starting with Monday-Sunday
export type WeekTimes = [string, string, string, string, string, string, string]
export type MealPeriodWithHours = MealPeriod & {
  openHours: WeekTimes, 
  closeHours: WeekTimes
};
export type DiningHallInformation = {
  mealPeriods: MealPeriodWithHours[],
  allergenIntoleranceCodes: {
    code: number,
    label: string   // e.g. Eggs
  } [],
  menuPreferenceCodes: {
    code: number,
    label: string   // e.g. Gluten Free
  } [],
  stationsInfo: {
    uid: string,
    name: string,   // e.g. Fire and Ice
    position: number,
  } [],
}