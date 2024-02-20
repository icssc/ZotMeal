import { z } from "zod";

import { RestaurantName } from "@zotmeal/db";
import { ID_TO_RESTAURANT } from "@zotmeal/utils";

const [restaurantId, ...restaurantIds] = Object.keys(ID_TO_RESTAURANT);
export const RestaurantSchema = z.object({
  id: z.enum([restaurantId!, ...restaurantIds]),
  name: z.nativeEnum(RestaurantName),
});

export type RestaurantParams = z.infer<typeof RestaurantSchema>;
