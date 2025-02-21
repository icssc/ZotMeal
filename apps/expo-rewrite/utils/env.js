import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string(),
  CLERK_PUBLISHABLE_KEY: z.string(),
  NODE_ENV: z.string(),
});
const env = envSchema.parse({
  API_URL: process.env.EXPO_PUBLIC_API_URL,
  CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  NODE_ENV: process.env.NODE_ENV,
});

export { env };
