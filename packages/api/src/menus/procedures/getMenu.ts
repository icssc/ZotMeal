import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../../trpc";
import { GetMenuSchema, getMenu } from "../services";

export const getMenuProcedure = publicProcedure
  .input(GetMenuSchema)
  .query(async ({ ctx: { db }, input }) => {
    const menu = await getMenu(db, input);

    if (!menu) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "menu not found",
      });
    }

    return menu;
  });
