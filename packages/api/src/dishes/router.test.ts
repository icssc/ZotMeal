import { TRPCError } from "@trpc/server";
import { describe } from "vitest";

import { apiTest } from "../../apiTest";
import { testData } from "../../testData";
import { upsertUser } from "../users/services";
import { upsertDish } from "./services";

describe("getDishProcedure", () => {
  apiTest("gets a dish", async ({ api, expect, db, testData }) => {
    await upsertDish(db, testData.dish);
    const result = await api.dish.get({
      id: testData.dish.id,
    });
    expect(result.id).toEqual(testData.dish.id);
    expect(result.numRatings).toEqual(0);
    expect(result.totalRating).toEqual(0);
  });

  apiTest("fails on invalid params", async ({ api, expect }) => {
    await expect(
      api.dish.get({
        id: 1 as unknown as "1",
      }),
    ).rejects.toThrowError(TRPCError);
  });
});

describe("rateDishProcedure", () => {
  const dishId = `${testData.dish.id}2` as const; // TODO: temporary workaround since db is dirtied between tests. should clear db after procedure tests
  apiTest("rates a dish", async ({ api, expect, testData, db }) => {
    await upsertDish(db, {
      ...testData.dish,
      id: dishId,
    });
    await upsertUser(db, testData.user);
    const result = await api.dish.rate({
      ...testData.rating,
      dishId: testData.dish.id,
    });
    const fetchedDish = await api.dish.get({
      id: testData.dish.id,
    });
    expect(result.dishId).toEqual(testData.dish.id);
    expect(result.rating).toEqual(fetchedDish.totalRating);
    expect(fetchedDish.numRatings).toEqual(1);
  });

  apiTest("updates existing rating", async ({ api, expect, testData, db }) => {
    await upsertDish(db, {
      ...testData.dish,
      id: dishId,
    });
    await upsertUser(db, testData.user);
    await api.dish.rate({
      ...testData.rating,
      dishId,
    });
    await api.dish.rate({
      ...testData.rating,
      dishId,
      rating: testData.rating.rating + 2,
    });
    const fetchedDish = await api.dish.get({
      id: dishId,
    });
    expect(fetchedDish.numRatings).toEqual(1);
    expect(fetchedDish.totalRating).toEqual(testData.rating.rating + 2);

    await api.dish.rate({
      ...testData.rating,
      dishId,
    });

    const fetchedDish2 = await api.dish.get({
      id: dishId,
    });
    expect(fetchedDish2.numRatings).toEqual(1);
    expect(fetchedDish2.totalRating).toEqual(fetchedDish.totalRating - 2);
  });

  apiTest("fails on invalid params", async ({ api, expect, testData }) => {
    await expect(
      api.dish.rate({
        ...testData.rating,
        dishId: 1 as unknown as "1",
      }),
    ).rejects.toThrow();
  });
});
