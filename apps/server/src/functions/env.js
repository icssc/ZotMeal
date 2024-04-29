import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  path: "../../../../.env",
});
const envSchema = z.object({
  DATABASE_URL: z.string(),
});

const env = envSchema.parse(process.env);
export { env };
