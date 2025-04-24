"use client";
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '../utils/trpc';
import superjson from "superjson";
import Toolbar from "@/components/ui/toolbar";

export function RootClient({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000',
          transformer: superjson,
          async headers() {
            return {
              "x-trpc-source": "next-js",
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Toolbar />
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
