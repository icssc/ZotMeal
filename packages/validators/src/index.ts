import { z } from "zod";

export * from "./campusdish";
export * from "./zotmeal";

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const GetMenuSchema = z.object({});