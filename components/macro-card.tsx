'use client';

import { motion } from 'framer-motion';
import { Wheat, Beef, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MacroCardProps {
  type: 'carbs' | 'protein' | 'fat';
  current: number;
  goal: number;
  delay?: number;
}

const macroConfig = {
  carbs: {
    icon: Wheat,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    progressColor: 'bg-amber-500',
    labelKey: 'macros.carbsShort',
  },
  protein: {
    icon: Beef,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    progressColor: 'bg-blue-500',
    labelKey: 'macros.proteinShort',
  },
  fat: {
    icon: Droplets,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
    progressColor: 'bg-rose-500',
    labelKey: 'macros.fatShort',
  },
};

export function MacroCard({ type, current, goal, delay = 0 }: MacroCardProps) {
  const config = macroConfig[type];
  const Icon = config.icon;
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        'rounded-xl p-3 flex flex-col items-center',
        config.bgColor
      )}
    >
      <div className={cn('p-2 rounded-full bg-white/60 dark:bg-black/20 mb-2', config.color)}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        {type === 'carbs' ? '碳水' : type === 'protein' ? '蛋白质' : '脂肪'}
      </span>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {current}/{goal}g
      </span>
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', config.progressColor)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
        />
      </div>
    </motion.div>
  );
}
