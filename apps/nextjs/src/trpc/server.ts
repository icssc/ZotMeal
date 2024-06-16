import { cache } from "react";
import { headers } from "next/headers";

import { createCaller, createTRPCContext } from "@zotmeal/api";

import { env } from "~/env";

// import { auth } from "@zotmeal/auth";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    connectionString: env.DATABASE_URL,
    // session: await auth(),
    headers: heads,
  });
});

export const api = createCaller(createContext);
