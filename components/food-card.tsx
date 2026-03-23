'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Food } from '@/types';
import { useAppStore } from '@/stores/app-store';

interface FoodCardProps {
  food: Food;
  index?: number;
  showAdd?: boolean;
  onAdd?: (food: Food) => void;
}

const categoryIcons: Record<string, string> = {
  staple: '🍚',
  meat: '🥩',
  vegetable: '🥬',
  fruit: '🍎',
  snack: '🍪',
  beverage: '🥤',
};

export function FoodCard({ food, index = 0, showAdd = true, onAdd }: FoodCardProps) {
  const { user } = useAppStore();
  const language = user.preferences.language;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      <Link href={`/food/${food.id}`}>
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-2xl">
            {categoryIcons[food.category]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {food.name[language]}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {food.calories} kcal / 100{food.unit}
            </p>
          </div>
          {showAdd && onAdd && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAdd(food);
              }}
              className="p-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
