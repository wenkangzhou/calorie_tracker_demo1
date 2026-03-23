'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/app-store";
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

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAppStore();
  const { theme } = user.preferences;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateTheme = () => {
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      updateTheme();
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Prevent hydration mismatch by not rendering until mounted
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
