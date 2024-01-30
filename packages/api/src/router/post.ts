import { z } from "zod";

import { CreatePostSchema } from "@acme/validators";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
    // id: number;
    // title: string;
    // content: string | null;
    // published: boolean;
    // authorId: number;
    return ctx.db.post.findMany({
      orderBy: {
        id: "desc",
      },
    });
    // return ctx.db.query.post.findMany({
    //   orderBy: desc(schema.post.id),
    //   limit: 10,
    // });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      // return ctx.db
      //   .select()
      //   .from(schema.post)
      //   .where(eq(schema.post.id, input.id));

      return ctx.db.post.findFirst({
        // where: eq(schema.post.id, input.id),
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(CreatePostSchema)
    .mutation(({ ctx, input }) => {
      // return ctx.db.insert(schema.post).values(input);
      return ctx.db.post.create({
        data: input,
      });
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
    // return ctx.db.delete(schema.post).where(eq(schema.post.id, input));
    return ctx.db.post.delete({
      where: { id: input },
    });
  }),
});
