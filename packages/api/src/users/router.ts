import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { UserSchema } from "@zotmeal/db";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { getUser, upsertUser } from "./services";

const getUserProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(
    async ({ ctx: { db }, input }) =>
      await getUser(db, input.id).catch((e) => {
        if (e instanceof TRPCError) throw e;
        console.log("error getting user with input:", input);
        console.error(e);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "error getting user",
        });
      }),
  );

const upsertUserProcedure = publicProcedure.input(UserSchema).query(
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
  get: getUserProcedure,
  upsert: upsertUserProcedure,
});
