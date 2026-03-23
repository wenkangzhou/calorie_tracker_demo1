'use client';

import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChange, className, autoFocus = false }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('search.placeholder')}
        autoFocus={autoFocus}
        className={cn(
          'w-full h-12 pl-12 pr-10 bg-white dark:bg-slate-800',
          'rounded-full border border-gray-200 dark:border-slate-700',
          'text-gray-900 dark:text-white placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500',
          'transition-all duration-200'
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
