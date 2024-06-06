import { addDays } from "date-fns";
import { describe } from "vitest";

import { apiTest } from "../../apiTest";
import { upsertRestaurant } from "../restaurants/services";
import { upsertEvent } from "./services";

describe("getEvents", () => {
  apiTest(
    "gets all events that are happening today or later",
    async ({ api, db, expect, testData }) => {
      await upsertRestaurant(db, testData.restaurant);
      const event = await upsertEvent(db, testData.event);
      const eventFuture = await upsertEvent(db, {
        ...testData.event,
        title: "eventFuture",
        start: new Date(addDays(new Date(), 1)),
        end: new Date(addDays(new Date(), 2)),
      });
      const eventPast = await upsertEvent(db, {
        ...testData.event,
        title: "eventPast",
        start: new Date(addDays(new Date(), -1)),
        end: new Date(addDays(new Date(), -2)),
      });

      expect(event.end >= new Date()).toBeTruthy();
      expect(eventFuture.end >= new Date()).toBeTruthy();
      expect(eventPast.end >= new Date()).toBeFalsy();

      const events = await api.event.get();

      expect(events).toHaveLength(2); // should not include the past event

      expect(events[0]).toEqual(
        expect.objectContaining({
          title: testData.event.title,
        }),
      );

      expect(events[1]).toEqual(
        expect.objectContaining({
          title: "eventFuture",
        }),
      );
    },
  );

  apiTest.todo("gets no events if no events are happening today or later");
});
