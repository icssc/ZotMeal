import { PrismaClient } from "@zotmeal/db";
import { afterAll, describe, expect, it } from "vitest";
import { insertEvents, scrapeEvents } from "./event";

describe("insert menu into db", () => {
  const db = new PrismaClient();

  it("scrapes events data and returns it in the form of EventSchema", async () => {
    let errorOccurred = false;

    try {
      const events = await scrapeEvents();

      if (!events) {
        throw new Error("events is null");
      }

      console.log("events:", events);
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
        errorOccurred = true;
      }
    }

    expect(errorOccurred).toBe(false);
  });

  it("scrapes events data and inserts it into the db", async () => {
    let errorOccurred = false;

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
      if (e instanceof Error && e.message !== 'rollback') {
        console.error(e);
        errorOccurred = true;
      }
    }

    expect(errorOccurred).toBe(false);
  });

  // it("", () => {
  //   // add an integration test, ideally using testcontainers
  // });

  afterAll(async () => {
    await db.$disconnect();
  });
});
