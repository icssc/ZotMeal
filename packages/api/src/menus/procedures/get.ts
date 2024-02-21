import { TRPCError } from "@trpc/server";

import { publicProcedure } from "../../trpc";
import { GetMenuSchema } from "../models/menu";
import { getMenu } from "../services";

export const getMenuProcedure = publicProcedure
  .input(GetMenuSchema)
  .query(async ({ ctx, input }) => {
    const { db } = ctx;

    const menu = await getMenu(db, input);

    if (menu === null) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "menu not found",
      });
    }
  });

