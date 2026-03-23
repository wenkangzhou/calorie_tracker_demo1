'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { foodCategories } from '@/lib/foods-data';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const { user } = useAppStore();
  const language = user.preferences.language;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {foodCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            'relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
            selected === category.id
              ? 'text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          )}
        >
          {selected === category.id && (
            <motion.div
              layoutId="category-pill"
              className="absolute inset-0 bg-green-500 rounded-full"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">
            {category.name[language as 'zh' | 'en']}
          </span>
        </button>
      ))}
    </div>
  );
}
