import type { Station } from "@zotmeal/db";

export const testData: Station = {
  id: "station123",
  name: "test-station",
  restaurantId: "3314",
  createdAt: "2024-04-07 00:00:00",
  updatedAt: "2024-04-07 00:00:00",
};

export const updateData: Station = {
  id: "station123",
  name: "<UPDATE> test-station",
  restaurantId: "3314",
  createdAt: "2024-04-07 00:00:00",
  updatedAt: "2024-04-07 00:00:00",
};
