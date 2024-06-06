import { TRPCError } from "@trpc/server";
import { isSameDay } from "date-fns";
import { describe } from "vitest";

import { apiTest } from "../../apiTest";
import { insertDishMenuStationJoint, upsertDish } from "../dishes/services";
import { upsertRestaurant } from "../restaurants/services";
import { upsertStation } from "../stations/services";
import { upsertMenu } from "./services";

describe("getMenuProcedure", () => {
  const date = new Date();

  apiTest(
    "should get today's brandywine lunch menu",
    async ({ api, expect, db, testData }) => {
      await upsertRestaurant(db, testData.restaurant);
      await upsertStation(db, testData.station);
      await upsertDish(db, testData.dish);
      await upsertMenu(db, testData.menu);
      await insertDishMenuStationJoint(db, testData.joint);

      const menu = await api.menu.get({
        date,
        period: "lunch",
        restaurant: "brandywine",
      });

      expect(menu.date).toBe(testData.menu.date);
      expect(isSameDay(menu.date, testData.menu.date)).toBe(true);
    },
  );

  // TODO: have each invalid input give unique TRPCError message
  apiTest("should not get an invalid menu", async ({ api, expect }) => {
    await expect(
      api.menu.get({
        date: "4-24-2024" as unknown as Date,
        period: "lunch",
        restaurant: "brandywine",
      }),
    ).rejects.toThrowError(TRPCError);

    await expect(
      api.menu.get({
        date,
        period: "latelatenight" as "latenight",
        restaurant: "brandywine",
      }),
    ).rejects.toThrowError(TRPCError);

    await expect(
      api.menu.get({
        date,
        period: "lunch",
        restaurant: "antwine" as "anteatery",
      }),
    ).rejects.toThrowError(TRPCError);
  });
});
