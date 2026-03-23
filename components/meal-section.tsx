'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sunrise, Sun, Moon, Apple, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MealEntry, MealType } from '@/types';
import { useState } from 'react';

interface MealSectionProps {
  type: MealType;
  entries: MealEntry[];
  onAdd: (type: MealType) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

const mealConfig = {
  breakfast: {
    icon: Sunrise,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    label: '早餐',
    labelEn: 'Breakfast',
  },
  lunch: {
    icon: Sun,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    label: '午餐',
    labelEn: 'Lunch',
  },
  dinner: {
    icon: Moon,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    label: '晚餐',
    labelEn: 'Dinner',
  },
  snack: {
    icon: Apple,
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    label: '零食',
    labelEn: 'Snack',
  },
};

export function MealSection({ type, entries, onAdd, onDelete, delay = 0 }: MealSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = mealConfig[type];
  const Icon = config.icon;
  const totalCalories = entries.reduce((sum, e) => sum + e.totalCalories, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden"
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className={cn('p-2.5 rounded-xl', config.bgColor, config.color)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {config.label}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {entries.length > 0 ? `${entries.length} 个食物` : '暂无记录'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            {totalCalories} kcal
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && entries.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 dark:border-slate-700"
          >
            <div className="p-4 space-y-3">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-lg">
                      🍽️
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {entry.food.name.zh}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {entry.quantity}{entry.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {entry.totalCalories} kcal
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(entry.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 pb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd(type);
          }}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加食物
        </button>
      </div>
    </motion.div>
  );
}
