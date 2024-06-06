import { describe, it } from "vitest";

import { CampusDishResponseSchema } from "@zotmeal/validators";

import campusDishResponse from "../../menus/testdata/campus-dish-response.json";

describe("parse campus dish", () => {
  it("parses valid campus dish response", ({ expect }) => {
    expect(() =>
      CampusDishResponseSchema.parse(campusDishResponse),
    ).not.toThrow();
  });

  it("fails on invalid campus dish response", ({ expect }) => {
    expect(() => CampusDishResponseSchema.parse({})).toThrow();
  });
});
