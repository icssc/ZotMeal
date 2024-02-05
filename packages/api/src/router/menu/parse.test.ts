import { describe, expect, it } from "vitest";

import { CampusDishResponseSchema } from "@zotmeal/validators";

import campus_dish_response from "./campus_dish_response.json";
import { parseCampusDish } from "./parse";

describe("parse campus dish", () => {
  it("parses campus dish response", () => {
    expect(() => {
      const validated = CampusDishResponseSchema.parse(campus_dish_response);
      // open a db instance
      const menu = parseCampusDish(validated);
      console.log(menu);

      expect(menu).not.toBeNull();
    }).not.toThrow();
  });

  it("", () => {
    // add an integration test, ideally using testcontainers
  });
});
