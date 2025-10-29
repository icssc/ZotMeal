import { z } from "zod";

/* Represents the schema of the return data from query AEM_eventList */
export const AEMEventListSchema = z.object({
  data: z.object({
    AEM_eventList: z.object({
      items: z.array(
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
      )
    })
  })
});

/* Represents the schema of the return data from query getLocationRecipes 
 * for a daily query 
 */
export const GetLocationRecipesDailySchema = z.object({
  data: z.object({
    getLocationRecipes: z.object({
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
                  value: z.union([
                    z.string(), 
                    z.array(z.string())
                  ])
                })
              )
            })
          })
        )
      })
    })
  })
});

export const GetLocationRecipesWeeklySchema = z.object({
  data: z.object({
    getLocationRecipes: z.object({
      locationRecipesMap: z.object({
        dateSkuMap: z.array(
          z.object({
            date: z.string().date(),
            stations: z.array(
              z.object({
                id: z.number(),
                skus: z.object({
                  simple: z.array(
                    z.string(),
                  )
                })
              })
            )
          })
        ),
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
                  value: z.union([
                    z.string(), 
                    z.array(z.string())
                  ])
                })
              )
            })
          })
        )
      })
    })
  })
});

export const GetLocationSchema = z.object({
  data: z.object({
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
        maxMenusDate: z.string().date(),
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
              start_date: z.string().date().optional(),
              end_date: z.string().date().optional(),
            })
          )
        })
      })
    })
  })
})

export type EventList = z.infer<typeof AEMEventListSchema>;
export type LocationRecipesDaily = z.infer<typeof GetLocationRecipesDailySchema>;
export type LocationRecipesWeekly = z.infer<typeof GetLocationRecipesWeeklySchema>;
export type LocationInfo = z.infer<typeof GetLocationSchema>;
export type MealPeriod = LocationInfo["data"]["Commerce_mealPeriods"][0]

// Indexed starting with Monday-Sunday
export type WeekTimes = [string, string, string, string, string, string, string]
export type MealPeriodWithHours = MealPeriod & {
  openHours: WeekTimes, 
  closeHours: WeekTimes
};
export type DiningHallInformation = {
  mealPeriods: MealPeriodWithHours[],
  // Maps the allergen (e.g. "Eggs") to its code (39)
  allergenIntoleranceCodes: {[allergen: string]: number}, 
  // Maps the preference (e.g. "Gluten Free") to its code (78)
  menuPreferenceCodes: {[preference: string]: number}, 
  stationsInfo: {[uid: string]: string}, 
}

export const AvailableIntoleranceLabels = [
  "Eggs",
  "Fish",
  "Milk",
  "Peanuts",
  "Sesame",
  "Shellfish",
  "Soy",
  "Tree Nuts",
  "Wheat",
]