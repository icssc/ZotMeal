import { z } from "zod";

export const MenuPeriodSchema = z.object({
  id: z.string(),
  name: z.string(),
  start: z.string(),
  end: z.string(),
});

export type MenuPeriodParams = z.infer<typeof MenuPeriodSchema>;
