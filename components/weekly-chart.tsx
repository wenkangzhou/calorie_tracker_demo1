'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { format, subDays, getDay } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

interface WeeklyChartProps {
  data?: { date: string; dayName: string; calories: number; goal: number }[];
}

const dayNamesZh = ['日', '一', '二', '三', '四', '五', '六'];
const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function WeeklyChart({ data }: WeeklyChartProps) {
  const { user, selectedDate, getDailyStats } = useAppStore();
  const { language, theme } = user.preferences;
  const goal = user.dailyCalorieGoal;

  // Generate week data if not provided
  const weekData = data || (() => {
    const today = new Date(selectedDate);
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const stats = getDailyStats(dateStr);
      const dayIndex = getDay(date);
      days.push({
        date: dateStr,
        dayName: language === 'zh' ? dayNamesZh[dayIndex] : dayNamesEn[dayIndex],
        calories: stats.totalCalories,
        goal,
      });
    }
    return days;
  })();

  const maxValue = Math.max(...weekData.map(d => d.calories), goal);
  const chartHeight = 120;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        {language === 'zh' ? '本周概览' : 'Weekly View'}
      </h3>
      
      <div className="flex items-end justify-between h-32 gap-2">
        {weekData.map((day, index) => {
          const height = (day.calories / maxValue) * chartHeight;
          const isOverGoal = day.calories > goal;
          const isToday = day.date === selectedDate;
          
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full flex justify-center" style={{ height: chartHeight }}>
                {/* Goal line indicator */}
                <div
                  className="absolute w-full border-t border-dashed border-gray-300 dark:border-gray-600"
                  style={{ bottom: `${(goal / maxValue) * chartHeight}px` }}
                />
                
                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 4)}px` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`w-full max-w-8 rounded-t-lg ${
                    isOverGoal
                      ? 'bg-amber-400 dark:bg-amber-500'
                      : 'bg-green-500 dark:bg-green-500'
                  } ${isToday ? 'ring-2 ring-green-500 ring-offset-2 dark:ring-offset-slate-800' : ''}`}
                />
              </div>
              
              <span className={`text-xs ${isToday ? 'font-semibold text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {day.dayName}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-gray-600 dark:text-gray-400">
            {language === 'zh' ? '达标' : 'On Track'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-400" />
          <span className="text-gray-600 dark:text-gray-400">
            {language === 'zh' ? '超标' : 'Over'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 border-t border-dashed border-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            {language === 'zh' ? '目标' : 'Goal'}
          </span>
        </div>
      </div>
    </div>
  );
}
