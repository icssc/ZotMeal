import { afterAll, describe, expect, it } from "vitest";

import { PrismaClient } from "@zotmeal/db";

import { insertEvents, scrapeEvents } from "../services";

describe("insert menu into db", () => {
  const db = new PrismaClient();

  it("scrapes events data and returns it in the form of EventSchema", () => {
    expect(async () => {
      const events = await scrapeEvents();

      if (!events) {
        throw new Error("events is null");
      }

      console.log("events:", events);
    }).not.toThrow();
  });
  // refactor this to only test the insertion
  // test the scrape separately from the insertion
  it("scrapes events data and inserts it into the db", () => {
    expect(async () => {
      try {
        const events = await scrapeEvents();
        if (!events) {
          throw new Error("events is null");
        }

        await db.$transaction(async (trx) => {
          const insertedEvents = await insertEvents(trx, events);
          if (!insertedEvents) {
            throw new Error("insertedEvents is null");
          }

          console.log("insertedEvents:", insertedEvents);

          // Rollback the transaction to undo the insert
          throw new Error("rollback");
        });
      } catch (e) {
        if (e instanceof Error && e.message !== "rollback") {
          console.error(e);
        }
      }
    }).not.toThrow();
  });

  // it("", () => {
  //   // add an integration test, ideally using testcontainers
  // });

  afterAll(async () => {
    await db.$disconnect();
  });
});
