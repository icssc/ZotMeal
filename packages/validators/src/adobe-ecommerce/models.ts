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

export type EventList = z.infer<typeof AEMEventListSchema>;