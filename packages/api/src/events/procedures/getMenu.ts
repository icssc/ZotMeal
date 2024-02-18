import { publicProcedure } from "../../trpc";
import {z} from "zod";

export const getEvents = publicProcedure.input(z.object({})).query(async ({ ctx }) => {
  const { db } = ctx;

  const events = db.event.findMany();

  return events;
});
