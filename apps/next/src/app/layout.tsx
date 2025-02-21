import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import Toolbar from "@/components/ui/toolbar";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "ZotMeal",
  description: `ZotMeal: A dynamic web app to discover everything UCI's dining 
                halls have to offer – from daily menus and special events to 
                dining hall features and updates.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Toolbar></Toolbar>
        <div className="grid grid-cols-2 max-w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
