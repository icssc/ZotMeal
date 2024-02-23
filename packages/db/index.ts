import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export * from "@prisma/extension-accelerate";

export * from "@prisma/client";

export const db = new PrismaClient().$extends(withAccelerate());

export type PrismaClientWithAccelerate = typeof db;

export type TransactionClientWithAccelerate = Parameters<Parameters<PrismaClientWithAccelerate["$transaction"]>[0]>[0]
// Prisma

// function x(db: PrismaClientWithAccelerate) {}

// await db.$transaction((tx) => {
//   x(tx);

//   return 1;
// });
