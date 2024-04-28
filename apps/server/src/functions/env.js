import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
});

const env = envSchema.parse(process.env);
export { env };
