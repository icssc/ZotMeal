import type { Station } from "@zotmeal/db/src/schema";

export const testData: Station = {
  id: "station123",
  name: "test-station",
  restaurantId: "9999",
  createdAt: "2024-04-07 00:00:00",
  updatedAt: "2024-04-07 00:00:00",
};

export const updateData: Station = {
  id: "station123",
  name: "<UPDATE> test-station",
  restaurantId: "9999",
  createdAt: "2024-04-07 00:00:00",
  updatedAt: "2024-04-07 00:00:00",
};
