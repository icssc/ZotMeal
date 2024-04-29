import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  path: "../../../../.env",
});

const envSchema = z.object({
  DATABASE_URL: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
});
const env = envSchema.parse(process.env);
export { env };
