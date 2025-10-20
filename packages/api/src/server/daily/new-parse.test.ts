import { 
  GetLocationSchema, 
  GetLocationRecipesSchema,
  AEMEventListSchema,
} from "@zotmeal/validators";
import { describe, it } from "vitest";

import getLocation from "./testData/getLocation.json";
import getLocationRecipes from "./testData/getLocationRecipes.json"
import AEMEventList from "./testData/AEM_eventList.json"

describe("Parse AdobeECommerce Responses", () => {
  it("parses getLocation response", ({ expect }) => {
    expect(() => GetLocationSchema.parse(getLocation)).not.toThrow();
  });

  it("parses getLocationRecipes response", ({ expect }) => {
    expect(() => GetLocationRecipesSchema.parse(getLocationRecipes)).not.toThrow();
  });

  it("parses AEMEventList response", ({ expect }) => {
    expect(() => AEMEventListSchema.parse(AEMEventList)).not.toThrow();
  });
});