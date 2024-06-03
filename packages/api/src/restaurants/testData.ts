import type { Restaurant } from "@zotmeal/db";

export const testData = {
  id: "3056",
  name: "brandywine",
} satisfies Restaurant;

export const updateData = { ...testData };
