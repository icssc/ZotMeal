import { TRPCError } from "@trpc/server";
import { PushTokenSchema, pushToken } from "@zotmeal/db/src/schema";
import { Expo } from "expo-server-sdk";
import { publicProcedure } from "../../trpc";

export const registerPushToken = publicProcedure
  .input(PushTokenSchema)
  .query(async ({ ctx, input }) => {
    const { db } = ctx;

    if (!Expo.isExpoPushToken(input.token)) {
      console.error("pushToken", pushToken);
      throw new TRPCError({
        message: "invalid push token",
        code: "BAD_REQUEST",
      });
    }
    try {
      await db.insert(pushToken).values(input)
    } catch (e) {
      // TODO: do similar handling as below but with Drizzle

      // if (e instanceof Prisma.PrismaClientValidationError) {
      //   throw new TRPCError({
      //     message: "invalid data",
      //     code: "BAD_REQUEST",
      //   });
      // } else {
      //   throw new TRPCError({
      //     message: "unknown error",
      //     code: "INTERNAL_SERVER_ERROR",
      //   });
      // }

      throw new TRPCError({
        message: "unknown error",
        code: "INTERNAL_SERVER_ERROR",
      });

    }

    // test if it is a valid expo push token

    //
  });
