import { z } from "zod";

import { EventTable } from "@zotmeal/db";

import { publicProcedure } from "../../trpc";

export const getEvents = publicProcedure
  .input(z.object({}))
  .query(async ({ ctx: { db } }) => {
    // await db.query.event.findMany()

    const events = await db.select().from(EventTable).execute();
    return events;
  });
