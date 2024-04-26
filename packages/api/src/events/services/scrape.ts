import axios from "axios";
import * as cheerio from "cheerio";

import type { Event } from "@zotmeal/db/src/schema";
import { EventSchema } from "@zotmeal/db/src/schema";
import { parseEventDate, RESTAURANT_TO_ID } from "@zotmeal/utils";

import { logger } from "../../../logger";

export async function getHTML(url: string): Promise<string> {
  try {
    const res = await axios.get(url);
    if (typeof res.data === "string") {
      return res.data;
    }
    throw new Error("response data is not a string");
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Error fetching from url: ${url}`, e.message);
    }
    throw e;
  }
}

export async function scrapeEvents(html: string): Promise<Event[] | null> {
  try {
    const $ = cheerio.load(html);

    const events: Event[] = [];

    // iterate through each event item and extract data
    // TODO: parallelize this
    for (const el of $("li")) {
      const eventItem = $(el);

      const title = eventItem.find(".gridItem_title_text").text();
      const imageSrc = eventItem.find("img").attr("src");

      const image = imageSrc ? `https://uci.campusdish.com${imageSrc}` : "";

      // do an inner fetch on the event's page for restaurant association
      const href = eventItem.find("a").attr("href");
      if (!href) continue; // skip if unable to find event page link
      logger.debug(href);
      const eventPageHtml = await getHTML(href);

      // skip if unable to fetch event page
      if (!eventPageHtml) {
        console.error("unable to fetch event page for event: ", title);
        continue;
      }

      const eventPage$ = cheerio.load(eventPageHtml);

      const longDescription = eventPage$(".col-xs-6").text();

      // e.g. APRIL 22 11:00 AM – APRIL 27 3:00 PM
      const eventDates = eventPage$(".dates").text().trim().split("–");

      if (eventDates.length !== 2) {
        console.error("invalid date format", eventDates);
        continue;
      }

      const [start, end] = eventDates.map(parseEventDate);

      if (!start || !end) {
        console.error("invalid date format", eventDates);
        continue;
      }

      // logic to conform to restaurant enum
      // could be cleaner but the html isn't always in the same format

      const restaurantArray = eventPage$(".location")
        .text()
        .toLowerCase()
        .replace(/[^a-z: ]/g, "") // allow letters, spaces, colons
        .split(":") // "location: the anteatery" -> ["location", "the anteatery"]
        .pop()
        ?.split(" "); // "the anteatery" -> ["the", "anteatery"] or [ '', '', 'brandywine', '', '', '', '', '', '', '', '', '' ]

      const restaurant = restaurantArray?.includes("anteatery")
        ? "anteatery"
        : "brandywine";

      const shortDescription = eventItem
        .find(".gridItem__body")
        .first()
        .text()
        .trim();

      const restaurantId = RESTAURANT_TO_ID[restaurant];

      if (!restaurantId) {
        console.error("invalid restaurant", restaurant);
        continue;
      }

      const event = EventSchema.parse({
        title,
        image,
        restaurantId,
        shortDescription,
        longDescription,
        start,
        end,
      } satisfies Event);

      logger.debug(event);

      events.push(event);
    }

    return events;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
  }
  return null;
}
