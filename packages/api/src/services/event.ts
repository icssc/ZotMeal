import type { Prisma, PrismaClient } from "@zotmeal/db";
import { Event, EventSchema } from "@zotmeal/validators";
import axios from "axios";
import * as cheerio from "cheerio";

async function getHTML(url: string) {
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

export async function scrapeEvents() {
  try {
    const html = await getHTML("https://uci.campusdish.com/api/events");
    if (!html) {
      return null;
    }

    const $ = cheerio.load(html);

    const events: Event[] = [];

    // iterate through each event item and extract data
    $("li").each((i, el) => {
      const eventItem = $(el);

      const title = eventItem
        .find(".gridItem_title_text")
        .text();
      const href = eventItem
        .find("a")
        .attr("href");
      const link = `https://uci.campusdish.com${href}`;
      const description = eventItem
        .find(".gridItem__body")
        .children()
        .first()
        .text();

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
        link,
        description,
        date,
      };

      const validated = EventSchema.parse(event);

      events.push(validated);
    });

    return events;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
  }
}

export async function insertEvents(
  db: PrismaClient | Prisma.TransactionClient,
  events: Event[],
) {
  try {
    // fetch any existing events that match any events passed in
    const existingEvents = await db.event.findMany({
      where: {
        OR: events.map((event) => ({
          title: event.title,
          date: event.date,
          link: event.link,
        })),
      },
    });

    // filter out existing events
    const newEvents = events.filter(
      (event) =>
        !existingEvents.some(
          (existingEvent) =>
            existingEvent.title === event.title &&
            existingEvent.link === event.link &&
            new Date(existingEvent.date).getTime() === new Date(event.date).getTime()
        )
    );

    // insert new events
    if (newEvents.length > 0) {
      await db.event.createMany({
        data: newEvents,
      });
    }

    return newEvents;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
  }
}
