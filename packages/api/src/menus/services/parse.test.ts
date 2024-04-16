import { describe, expect, it } from "vitest";

import { CampusDishResponseSchema } from "@zotmeal/validators";

import campus_dish_response from "./campus_dish_response.json";

describe("parse campus dish", () => {
  it("parses valid campus dish response", () => {
    expect(() => {
      CampusDishResponseSchema.parse(campus_dish_response);
    }).not.toThrow;
  });

  it("fails on invalid campus dish response", () => {
    expect(() => {
      CampusDishResponseSchema.parse({});
    }).toThrow();
  });
});
