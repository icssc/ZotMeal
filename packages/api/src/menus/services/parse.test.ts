// import { afterAll, describe, expect, it } from "vitest";

// import { PrismaClient } from "@zotmeal/db";
// import { CampusDishResponseSchema } from "@zotmeal/validators";

// import type { MenuParams } from "../models/menu";
// import campus_dish_response from "./campus_dish_response.json";
// import { saveMenu } from "./menu";

// // import { parseCampusDish } from './parse';

// describe("parse campus dish", () => {
//   it("parses valid campus dish response", () => {
//     expect(() => {
//       CampusDishResponseSchema.parse(campus_dish_response);
//     }).not.toThrow;
//   });

//   it("fails on invalid campus dish response", () => {
//     expect(() => {
//       CampusDishResponseSchema.parse({});
//     }).toThrow();
//   });
// });

// describe("insert menu into db", () => {
//   const db = new PrismaClient();

//   it("inserts valid menu into db", async () => {
//     const tests: MenuParams[] = [];
//     for (const test of tests) {
//       await db.$transaction(async (trx) => {
//         const menu = await saveMenu(trx, test);
//         expect(menu).not.toBe(null);
//         console.log("insertedMenu:", menu);

//         throw new Error("rollback");
//       });
//     }
//   });

//   afterAll(async () => {
//     await db.$disconnect();
//   });
// });
