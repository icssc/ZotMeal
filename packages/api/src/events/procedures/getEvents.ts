import { z } from "zod";

import { publicProcedure } from "../../trpc";

export const getEvents = publicProcedure
  .input(z.object({}))
  .query(async ({ ctx: { db } }) =>
    await db.query.event.findMany()
  );
