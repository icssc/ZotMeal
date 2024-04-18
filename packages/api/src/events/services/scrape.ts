import axios from "axios";
import * as cheerio from "cheerio";

import type { Event } from "@zotmeal/db/src/schema";
import { EventSchema } from "@zotmeal/db/src/schema";
import { RESTAURANT_TO_ID } from "@zotmeal/utils";

export async function getHTML(url: string): Promise<string> {
  try {
    const res = await axios.get(url);
    if (typeof res.data === "string") {
      return res.data;
    }
    throw new Error("response data is not a string");
  } catch (e) {
    console.error(`Error fetching from url: ${url}`, e.message);
    throw e;
  }
}

export async function scrapeEvents(html: string): Promise<Event[] | null> {
  try {
    const $ = cheerio.load(html);

    const events: Event[] = [];

    // iterate through each event item and extract data
    for (const el of $("li")) {
      const eventItem = $(el);

      const title = eventItem.find(".gridItem_title_text").text();
      const imageSrc = eventItem.find("img").attr("src");

      const image = `https://uci.campusdish.com${imageSrc}`;

      // do an inner fetch on the event's page for restaurant association
      const href = eventItem.find("a").attr("href");
      if (!href) continue; // skip if unable to find event page link
      const eventPageUrl = href;
      console.log(eventPageUrl);
      const eventPage = await getHTML(eventPageUrl);
      if (!eventPage) continue; // skip if unable to fetch event page
      const eventPage$ = cheerio.load(eventPage);

      // logic to conform to restaurant enum
      // could be cleaner but the html isn't always in the same format

      const restaurantArray = eventPage$(".location")
        .text()
        .toLowerCase()
        .replace(/[^a-z: ]/g, "") // allow letters, spaces, colons
        .split(":") // "location: the anteatery" -> ["location", "the anteatery"]
        .pop()
        ?.split(" "); // "the anteatery" -> ["the", "anteatery"] or [ '', '', 'brandywine', '', '', '', '', '', '', '', '', '' ]

      const restaurant =
        restaurantArray && restaurantArray.includes("anteatery")
          ? "anteatery"
          : "brandywine";

      const description = eventItem
        .find(".gridItem__body")
        .first()
        .text()
        .trim();

      // format into Date object
      const dayString = eventItem
        .find(".disclaimers")
        .children()
        .first()
        .text();
      const timeString = eventItem
        .find(".disclaimers")
        .children()
        .last()
        .text();
      const currentYear = new Date().getFullYear();
      const dateString = `${dayString}, ${currentYear}, ${timeString}`;
      const date = new Date(dateString);

      const restaurantId = RESTAURANT_TO_ID[restaurant];
      const event = {
        title,
        image,
        restaurant,
        description,
        date,
        restaurantId,
      };
      console.log(event);
      const validEvent = EventSchema.parse(event);

      events.push(validEvent);
    }

    return events;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
  }
  return null;
}
