import { describe, expect, it } from "vitest";

import type { DishWithRelations, User } from "@zotmeal/db";
import { createDrizzle, Rating } from "@zotmeal/db";

import { upsertDish } from "../dishes/services";
import { upsertUser } from "../users/services";
import {
  getNumRatingsByDishId,
  getTotalRatingByDishId,
  upsertRating,
} from "./services";

const dishId = "dish123";
const userId = "user123";
const menuId = "menu123";
const stationId = "station123";

const dish = {
  id: dishId,
  name: "Grilled Salmon with Quinoa",
  description:
    "A heart-healthy dish featuring omega-3 rich salmon, served over a bed of fluffy quinoa with a side of steamed asparagus.",
  category: "Main Course",
  menuId,
  stationId,
  dietRestriction: {
    dishId,
    containsEggs: false,
    containsFish: true,
    containsMilk: false,
    containsPeanuts: false,
    containsSesame: false,
    containsShellfish: false,
    containsSoy: false,
    containsTreeNuts: false,
    containsWheat: false,
    isGlutenFree: true,
    isHalal: true,
    isKosher: false,
    isLocallyGrown: true,
    isOrganic: true,
    isVegan: false,
    isVegetarian: false,
  },
  nutritionInfo: {
    dishId,
    servingSize: "350",
    servingUnit: "grams",
    calories: "560",
    caloriesFromFat: "190",
    totalFatG: "21g",
    transFatG: "0g",
    saturatedFatG: "4g",
    cholesterolMg: "125mg",
    sodiumMg: "650mg",
    totalCarbsG: "45g",
    dietaryFiberG: "6g",
    sugarsMg: "5g",
    proteinG: "45g",
    vitaminAIU: "25%",
    vitaminCIU: "30%",
    calciumMg: "4%",
    ironMg: "15%",
  },
} satisfies DishWithRelations;

const user = {
  id: userId,
  name: "John Doe",
} satisfies User;

const rating = {
  dishId,
  rating: 5,
  userId,
} satisfies Rating;

const updatedRating = {
  ...rating,
  rating: 4,
};

describe("upsertRating", () => {
  const db = createDrizzle({ connectionString: process.env.DB_URL! });
  it("inserts a rating", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertDish(trx, dish);
        await upsertUser(trx, user);
        const result = await upsertRating(trx, rating);

        expect(result.rating).toEqual(rating.rating);

        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });

  it("updates a rating", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertDish(trx, dish);
        await upsertUser(trx, user);
        const insertedRating = await upsertRating(trx, rating);
        const newRating = await upsertRating(trx, updatedRating);
        expect(newRating.rating).not.toEqual(insertedRating.rating);
        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
});

describe("getNumRatingsByDishId", () => {
  const db = createDrizzle({ connectionString: process.env.DB_URL! });
  it("returns the number of ratings for a dish", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertDish(trx, dish);
        await upsertUser(trx, user);
        let numRatings = await getNumRatingsByDishId(trx, rating.dishId);
        expect(numRatings).toEqual(0);
        const result = await upsertRating(trx, rating);
        numRatings = await getNumRatingsByDishId(trx, result.dishId);
        expect(numRatings).toEqual(1);
        await upsertRating(trx, {
          ...rating,
          userId: "2",
        });
        await upsertRating(trx, {
          ...rating,
          userId: "3",
        });
        numRatings = await getNumRatingsByDishId(trx, result.dishId);
        expect(numRatings).toEqual(3);
        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
});

describe("getTotalRatingByDishId", () => {
  const db = createDrizzle({ connectionString: process.env.DB_URL! });
  it("returns the total rating for a dish", async () => {
    await expect(async () => {
      await db.transaction(async (trx) => {
        await upsertDish(trx, dish);
        await upsertUser(trx, user);
        await upsertRating(trx, rating);
        await upsertRating(trx, {
          ...rating,
          userId: "2",
        });
        let totalRating = await getTotalRatingByDishId(trx, rating.dishId);
        expect(totalRating).toEqual(10);
        await upsertRating(trx, {
          ...rating,
          rating: 1,
        });
        totalRating = await getTotalRatingByDishId(trx, rating.dishId);
        expect(totalRating).toEqual(6);
        trx.rollback();
      });
    }).rejects.toThrowError("Rollback");
  });
});
