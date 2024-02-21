import { z } from "zod";

export const StationSchema = z.object({
  id: z.string(),
  restaurantId: z.string(),
  name: z.string(),
});

export type StationParams = z.infer<typeof StationSchema>;
