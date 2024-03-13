import { RestaurantName } from "@zotmeal/db";
import { z } from "zod";

// import { DateRegex } from "@zotmeal/validators";

export const EventSchema = z.object({
  title: z.string(),
  image: z.string().url(),
  restaurant: z.nativeEnum(RestaurantName),
  description: z.string(),
  date: z.date(),
});

export type EventParams = z.infer<typeof EventSchema>;

export const GetEventSchema = z.object({});

export type GetEventParams = z.infer<typeof GetEventSchema>;
