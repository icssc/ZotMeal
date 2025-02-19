import { useState } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { useAuth } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";

import type { AppRouter } from "@zotmeal/api";

import { env } from "./env";

/**
 * A set of typesafe hooks for consuming your API.
 */
export const api = createTRPCReact<AppRouter>();
export { type RouterInputs, type RouterOutputs } from "@zotmeal/api";

/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
export const getBaseUrl = () => {
  if (Platform.OS === "web") return "http://localhost:3000";
  if (Platform.OS === "android") return `http://10.0.2.2:3000`;

  /**
   * Gets the IP address of your host-machine. If it cannot automatically find it,
   * you'll have to manually set it. NOTE: Port 3000 should work for most but confirm
   * you don't have anything else running on it, or you'd have to change it.
   *
   * **NOTE**: This is only for development. In production, you'll want to set the
   * baseUrl to your production API URL.
   */
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  return env.API_URL;

  // if (!localhost) {
  //   // return "https://turbo.t3.gg";
  //   throw new Error(
  //     "Failed to get localhost. Please point to your production server.",
  //   );
  // }

  return `http://${localhost}:3000`;
};

/**
 * A wrapper for your app that provides the TRPC context.
 * Use only in _app.tsx
 */
export function TRPCProvider(props: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => {
    return api.createClient({
      links: [
        httpBatchLink({
          url: getBaseUrl(),
          transformer: superjson,
          headers: async () => ({
            Authorization: (await getToken()) ?? undefined,
            "x-trpc-source": `expo-react-${Platform.OS}`,
          }),
        }),
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
          colorMode: "ansi",
        }),
      ],
    });
  });

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
}
