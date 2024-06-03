import type { Station } from "@zotmeal/db";

export const testData: Station = {
  id: "station123",
  name: "test-station",
  restaurantId: "3314",
};

export const updateData: Station = {
  ...testData,
  name: "<UPDATE> test-station",
};
