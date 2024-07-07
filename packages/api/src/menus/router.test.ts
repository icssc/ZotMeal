// import { apiTest } from "@api/apiTest";
// import { upsertDish, upsertDishToMenu } from "@api/dishes/services";
// import { upsertPeriod } from "@api/periods/services";
// import { upsertRestaurant } from "@api/restaurants/services";
// import { upsertStation } from "@api/stations/services";
// import { testData } from "@api/testData";
// import { isSameDay } from "date-fns";
// import { describe } from "vitest";

// import { upsertMenu } from "./services";

// describe("getRestaurantMenusByDate", () => {
//   const date = new Date();

//   apiTest(
//     `should get today's ${testData.brandywine.name} menus for every period`,
//     async ({ api, expect, db, testData }) => {
//       await upsertRestaurant(db, testData.brandywine);
//       await upsertRestaurant(db, testData.anteatery);
//       await upsertStation(db, testData.station);
//       await upsertStation(db, {
//         ...testData.station,
//         id: "station2",
//         restaurantId: testData.anteatery.id,
//         name: "bakery",
//       });
//       await upsertDish(db, testData.dish);
//       await upsertDish(db, {
//         ...testData.dish,
//         id: "dish2",
//       });
//       await upsertPeriod(db, testData.period);
//       await upsertPeriod(db, {
//         ...testData.period,
//         id: "period2",
//         name: "latenight",
//         startTime: "20:00:00",
//         endTime: "22:00:00",
//       });
//       await upsertPeriod(db, {
//         ...testData.period,
//         id: "period3",
//         name: "dinner",
//         startTime: "22:00:00",
//         endTime: "23:00:00",
//       });
//       await upsertMenu(db, testData.menu);
//       await upsertMenu(db, {
//         ...testData.menu,
//         id: "menu2",
//         periodId: "period2",
//       });
//       await upsertDishToMenu(db, testData.dishToMenu);
//       await upsertDishToMenu(db, {
//         ...testData.dishToMenu,
//         menuId: "menu2",
//         dishId: "dish2",
//       });

//       const menus = await api.menu.getRestaurantsByDate({
//         date,
//         restaurantId: testData.brandywine.id,
//       });

//       expect(menus.length).toBe(2);
//       expect(isSameDay(menus[0]!.date, testData.menu.date)).toBe(true);
//     },
//   );

//   apiTest(
//     "should return empty array for an unavailable date",
//     async ({ api, expect }) => {
//       await expect(
//         api.menu.getRestaurantsByDate({
//           date: new Date("2025-04-24"),
//           restaurantId: testData.brandywine.id,
//         }),
//       ).resolves.toEqual([]);
//     },
//   );
// });

// describe("getMenuProcedure", () => {
//   const date = new Date();

//   apiTest(
//     `should get today's ${testData.restaurant.name} ${testData.period.name} menu`,
//     async ({ api, expect, db, testData }) => {
//       await upsertRestaurant(db, testData.restaurant);
//       await upsertStation(db, testData.station);
//       await upsertDish(db, testData.dish);
//       await upsertPeriod(db, testData.period);
//       await upsertMenu(db, testData.menu);
//       await upsertDishMenuStationJoin(db, testData.join);

//       const menu = await api.menu.get({
//         date,
//         periodId: testData.period.id,
//         restaurantName: testData.restaurant.name,
//       });

//       expect(menu.date).toBe(testData.menu.date);
//       expect(isSameDay(menu.date, testData.menu.date)).toBe(true);
//     },
//   );

//   // TODO: have each invalid input give unique TRPCError message
//   apiTest(
//     "should not get an invalid menu",
//     async ({ api, expect, testData }) => {
//       await expect(
//         api.menu.get({
//           date: "4-24-2024" as unknown as Date,
//           periodId: testData.period.id,
//           restaurantName: "brandywine",
//         }),
//       ).rejects.toThrowError(TRPCError);

//       await expect(
//         api.menu.get({
//           date,
//           periodId: "latelatenight" as "latenight",
//           restaurantName: "brandywine",
//         }),
//       ).rejects.toThrowError(TRPCError);

//       await expect(
//         api.menu.get({
//           date,
//           periodId: testData.period.id,
//           restaurantName: "antwine" as "anteatery",
//         }),
//       ).rejects.toThrowError(TRPCError);
//     },
//   );
// });
