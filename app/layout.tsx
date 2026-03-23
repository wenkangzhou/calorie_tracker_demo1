'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="zh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-slate-900`}
      >
        <div className="max-w-md mx-auto min-h-screen bg-gray-50 dark:bg-slate-900 relative pb-20">
          {children}
        </div>
        {mounted && <BottomNav />}
      </body>
    </html>
  );
}
