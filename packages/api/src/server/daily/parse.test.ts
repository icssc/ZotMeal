import { describe, it } from "vitest";

import { CampusDishMenuSchema } from "@zotmeal/validators";

import campusDishResponse from "./testData/campus-dish-response.json";
import restaurantClosed from "./testData/restaurant-closed.json";

describe("parse campus dish", () => {
  it("parses valid campus dish response", ({ expect }) => {
    expect(() => CampusDishMenuSchema.parse(campusDishResponse)).not.toThrow();
  });

  it("correctly fails when restaurant is closed", ({ expect }) =>
    expect(() => CampusDishMenuSchema.parse(restaurantClosed)).toThrow());
});
