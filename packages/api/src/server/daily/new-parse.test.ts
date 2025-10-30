import { 
  GetLocationSchema, 
  GetLocationRecipesDailySchema,
  GetLocationRecipesWeeklySchema,
  AEMEventListSchema,
} from "@zotmeal/validators";
import { describe, it } from "vitest";

import getLocation from "./testData/getLocation.json";
import getLocationRecipesDaily from "./testData/getLocationRecipesDaily.json"
import getLocationRecipesWeekly from "./testData/getLocationRecipesWeekly.json"
import AEMEventList from "./testData/AEM_eventList.json"

describe("Parse AdobeECommerce Responses", () => {
  it("parses getLocation response", ({ expect }) => {
    expect(() => GetLocationSchema.parse(getLocation)).not.toThrow();
  });

  it("parses getLocationRecipesDaily response", ({ expect }) => {
    expect(() => GetLocationRecipesDailySchema.parse(getLocationRecipesDaily)).not.toThrow();
  });

  it("parses getLocationRecipesWeekly response", ({expect}) => {
    expect(() => GetLocationRecipesWeeklySchema.parse(getLocationRecipesWeekly)).not.toThrow();
  });

  it("parses AEMEventList response", ({ expect }) => {
    expect(() => AEMEventListSchema.parse(AEMEventList)).not.toThrow();
  });
});
