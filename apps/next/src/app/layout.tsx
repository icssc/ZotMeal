import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '../utils/trpc';
import { getBaseUrl } from "../../../expo-rewrite/utils/api";
import superjson from "superjson";
import { RootClient } from './layout-client';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ZotMeal",
  description: `ZotMeal: A dynamic web app to discover everything UCI's dining 
                halls have to offer – from daily menus and special events to 
                dining hall features and updates.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <RootClient>
          {children}
        </RootClient>
      </body>
    </html>
  );
}
