import { createTRPCRouter, publicProcedure } from "@api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { UserSchema } from "@zotmeal/db";

import { getUser, upsertUser } from "./services";

const getUserProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(
    async ({ ctx: { db }, input }) =>
      await getUser(db, input.id).catch((e) => {
        if (e instanceof TRPCError) throw e;
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "error getting user",
        });
      }),
  );

const upsertUserProcedure = publicProcedure.input(UserSchema).mutation(
  async ({ ctx: { db }, input }) =>
    await upsertUser(db, input).catch((e) => {
      if (e instanceof TRPCError) throw e;
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "error upserting user",
      });
    }),
);

export const userRouter = createTRPCRouter({
  /** Get a user by id. */
  get: getUserProcedure,
  /** Upsert a user. */
  upsert: upsertUserProcedure,
});
