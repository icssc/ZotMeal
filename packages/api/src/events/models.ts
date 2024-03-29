import { z } from "zod";

// import { DateRegex } from "@zotmeal/validators";

export const EventSchema = z.object({
  title: z.string(),
  link: z.string(),
  description: z.string(),
  date: z.date(),
});

export type EventParams = z.infer<typeof EventSchema>;

export const GetEventSchema = z.object({});

export type GetEventParams = z.infer<typeof GetEventSchema>;
