'use client';

import { Home, Search, BarChart2, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, labelKey: 'nav.home' },
  { path: '/search', icon: Search, labelKey: 'nav.search' },
  { path: '/progress', icon: BarChart2, labelKey: 'nav.progress' },
  { path: '/profile', icon: User, labelKey: 'nav.profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'relative flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-green-500'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-green-50 dark:bg-green-900/20 rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <Icon className={cn('w-5 h-5', isActive && 'scale-110')} />
                <span className="text-[10px] mt-0.5 font-medium">
                  {t(item.labelKey)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
