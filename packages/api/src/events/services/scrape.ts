import type { Event } from "@zotmeal/drizzle-db/src/schema";
import { EventSchema } from "@zotmeal/drizzle-db/src/schema";
import axios from "axios";
import * as cheerio from "cheerio";


export async function getHTML(url: string): Promise<string | undefined> {
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
  }
}

export async function scrapeEvents(html: string):
  Promise<Event[] | null> {
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
      const eventPageUrl = `https://uci.campusdish.com${href}`;
      const eventPage = await getHTML(eventPageUrl);
      if (!eventPage) continue; // skip if unable to fetch event page
      const eventPage$ = cheerio.load(eventPage);

      // logic to conform to restaurant enum
      // could be cleaner but the html isn't always in the same format
      const restaurant = eventPage$(".location")
        .text()
        .toLowerCase()
        .replace(/[^a-z: ]/g, '') // allow letters, spaces, colons
        .split(":") // "location: the anteatery" -> ["location", "the anteatery"]
        .pop()
        ?.split(" ") // "the anteatery" -> ["the", "anteatery"]
        .pop();

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

      const event = {
        title,
        image,
        restaurant,
        description,
        date,
      };

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
