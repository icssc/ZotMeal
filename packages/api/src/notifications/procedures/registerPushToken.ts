import { Expo } from "expo-server-sdk";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Prisma } from "@zotmeal/db";

import { publicProcedure } from "../../trpc";

export const registerPushToken = publicProcedure
  .input(z.object({ pushToken: z.string() }))
  .query(async ({ ctx, input }) => {
    const { db } = ctx;

    const { pushToken } = input;

    if (!Expo.isExpoPushToken(pushToken)) {
      console.error("pushToken", pushToken);
      throw new TRPCError({
        message: "invalid push token",
        code: "BAD_REQUEST",
      });
    }
    try {
      await db.pushToken.create({ data: { token: pushToken } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientValidationError) {
        throw new TRPCError({
          message: "invalid data",
          code: "BAD_REQUEST",
        });
      } else {
        throw new TRPCError({
          message: "unknown error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }

    // test if it is a valid expo push token

    //
  });
