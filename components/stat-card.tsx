'use client';

import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  suffix?: string;
  color?: 'green' | 'blue' | 'amber' | 'rose';
  delay?: number;
}

const colorMap = {
  green: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  rose: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20',
};

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 30 });
  const displayValue = useTransform(springValue, (latest) => Math.round(latest));

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span>{displayValue}</motion.span>;
}

export function StatCard({ icon: Icon, value, label, suffix = '', color = 'green', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700"
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', colorMap[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        <AnimatedNumber value={value} />
        {suffix && <span className="text-lg">{suffix}</span>}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
    </motion.div>
  );
}
