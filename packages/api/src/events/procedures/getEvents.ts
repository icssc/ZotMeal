import { z } from "zod";

import { EventTable } from "@zotmeal/db";

import { publicProcedure } from "../../trpc";

export const getEvents = publicProcedure
  .input(z.object({}))
  .query(
    async ({ ctx: { db } }) => await db.select().from(EventTable).execute(),
  );
