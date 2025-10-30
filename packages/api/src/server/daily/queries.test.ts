import { AEMEventListSchema, GetLocationRecipesDailySchema, GetLocationRecipesWeeklySchema, GetLocationSchema } from "@zotmeal/validators";
import { queryAdobeECommerce } from "./new-parse";

import {
  AEMEventListQuery,
  AEMEventListQueryVariables,
  getLocationQuery,
  GetLocationRecipesDailyQuery,
  GetLocationRecipesDailyVariables,
  GetLocationRecipesWeeklyQuery,
  GetLocationRecipesWeeklyVariables,
  type GetLocationQueryVariables
} from "./queries";

import {
  type AxiosResponse
} from "axios";

import { describe, it, expect } from "vitest";

interface TestCase<T> {
  name: string,
  query: string,
  variables: T,
  schema: Zod.ZodSchema;
}

const allApiQueries: TestCase<any>[] = [
  {
    name: "getLocation (Brandywine)",
    query: getLocationQuery,
    variables: {
      locationUrlKey: "brandywine",
      sortOrder: "ASC",
    } as GetLocationQueryVariables,
    schema: GetLocationSchema,
  },
  {
    name: "getLocationRecipes (Daily / Anteatery)",
    query: GetLocationRecipesDailyQuery,
    variables: {
      date: new Date().toLocaleString("fr-CA", {year: "numeric", month: "2-digit", day: "2-digit"}),
      locationUrlKey: "the-anteatery",
      mealPeriod: "",
      viewType: "DAILY"
    } as GetLocationRecipesDailyVariables,
    schema: GetLocationRecipesDailySchema,
  },
  {
    name: "getLocationRecipes (Weekly / Brandywine)",
    query: GetLocationRecipesWeeklyQuery,
    variables: {
      date: new Date().toLocaleString("fr-CA", {year: "numeric", month: "2-digit", day: "2-digit"}),
      locationUrlKey: "brandywine",
      mealPeriod: "",
      viewType: "WEEKLY"
    } as GetLocationRecipesWeeklyVariables,
    schema: GetLocationRecipesWeeklySchema,
  },
  {
    name: "AEM_eventList (The Anteatery)",
    query: AEMEventListQuery,
    variables: {
      campus: {
        _expressions: {
          _operator: "EQUALS",
          value: "campus",
        }
      },
      location: {
        name: {
          _expressions: {
            _operator: "EQUALS",
            value: "The Anteatery"
          }
        }
      }
    } as AEMEventListQueryVariables,
    schema: AEMEventListSchema,
  }
]

describe("AdobeECommerce API Integration Tests", () => {
  describe.each(allApiQueries)(
    "Query: $name", 
    ({ query, variables, schema, name }) => {

      it(`should successfully fetch data, not throw errors, and validate against Zod schema (${name})`, async () => {
        let response;
        let caughtError = null;

        try {
          response = await queryAdobeECommerce(query, variables);
        } catch (error) {
          caughtError = error;
        }

        expect(caughtError).toBeNull();

        expect(response).toBeDefined();
        expect(response).toHaveProperty('data');

        if (response && response.data) {
          const validationResult = schema.safeParse(response.data);
          
          if (!validationResult.success) {
            console.error(`Zod Validation Failed for query: ${name}`);
            console.error(validationResult.error.issues);
            expect(validationResult.success).toBe(true);
          }
          
          expect(validationResult.success).toBe(true);
        } else {
          expect(response).toHaveProperty('data'); 
        }
      });
    }
  );
});