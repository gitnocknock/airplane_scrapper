"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Hardcode for now to fix build, we'll make it dynamic later
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://tangible-guineapig-688.convex.cloud";
const convex = new ConvexReactClient(CONVEX_URL);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexProvider client={convex}>
          {children}
        </ConvexProvider>
      </body>
    </html>
  );
}