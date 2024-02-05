import { describe, expect, it } from "vitest";

import data from "./campus_dish_schema.json";
import { parseCampusDish } from "./parse";

describe("parse campus dish", () => {
  it("parses campus dish response", () => {
    expect(parseCampusDish(data)).not.toBeNull();
  });
});
