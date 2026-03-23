'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
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

// Dynamically import components that use client-side data
const BottomNav = dynamic(() => import("@/components/bottom-nav").then(mod => mod.BottomNav), {
  ssr: false,
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 relative pb-20">
        {children}
      </div>
    );
  }

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-slate-900`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <div className="max-w-md mx-auto min-h-screen bg-gray-50 dark:bg-slate-900 relative pb-20">
            {children}
          </div>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
