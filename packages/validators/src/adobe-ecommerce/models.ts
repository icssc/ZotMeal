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

export type EventList = z.infer<typeof AEMEventListSchema>;
export type LocationRecipes = z.infer<typeof GetLocationRecipesSchema>;