import { z } from "zod";

import { publicProcedure } from "../../trpc";

export const getEvents = publicProcedure
  .input(z.object({}))
  .query(async ({ ctx }) => {
    const { db } = ctx;

    const events = db.event.findMany();

    return events;
  });
