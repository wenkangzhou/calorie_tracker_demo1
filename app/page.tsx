'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/stores/app-store';
import { CircularProgress } from '@/components/circular-progress';
import { MacroCard } from '@/components/macro-card';
import { MealSection } from '@/components/meal-section';
import { MealType, MealEntry } from '@/types';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user, selectedDate, setSelectedDate, getDailyStats, removeMealEntry } = useAppStore();
  const [mounted, setMounted] = useState(false);
  
  // Client-side only state
  const [displayDate, setDisplayDate] = useState('');
  const [isToday, setIsToday] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState<{
    totalCalories: number;
    macros: { carbs: number; protein: number; fat: number };
    meals: Record<MealType, MealEntry[]>;
  }>({
    totalCalories: 0,
    macros: { carbs: 0, protein: 0, fat: 0 },
    meals: { breakfast: [], lunch: [], dinner: [], snack: [] }
  });

  useEffect(() => {
    setMounted(true);
    i18n.changeLanguage(user.preferences.language);
    
    // Calculate date display on client only
    const dateLocale = user.preferences.language === 'zh' ? zhCN : enUS;
    setDisplayDate(format(new Date(selectedDate), 'MM月dd日', { locale: dateLocale }));
    setIsToday(selectedDate === format(new Date(), 'yyyy-MM-dd'));
    
    // Calculate greeting on client only
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('dashboard.greeting'));
    else if (hour < 18) setGreeting(t('dashboard.greetingAfternoon'));
    else setGreeting(t('dashboard.greetingEvening'));
    
    // Get stats
    setStats(getDailyStats());
  }, [i18n, user.preferences.language, selectedDate, t, getDailyStats]);

  const { totalCalories, macros, meals } = stats;
  const { dailyCalorieGoal, macroGoals } = user;
  const remaining = Math.max(dailyCalorieGoal - totalCalories, 0);

  const handlePrevDay = () => {
    const date = subDays(new Date(selectedDate), 1);
    setSelectedDate(format(date, 'yyyy-MM-dd'));
  };

  const handleNextDay = () => {
    const date = addDays(new Date(selectedDate), 1);
    setSelectedDate(format(date, 'yyyy-MM-dd'));
  };

  const handleAddFood = (mealType: MealType) => {
    router.push('/search');
  };

  // Loading state to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-24 bg-gray-200 m-4 rounded-xl"></div>
          <div className="h-64 bg-gray-200 m-4 rounded-xl"></div>
          <div className="h-32 bg-gray-200 m-4 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 px-4 py-4 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <User className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {greeting}
              </p>
              <h1 className="font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={handlePrevDay}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[100px] text-center">
            {displayDate}
            {isToday && (
              <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                {user.preferences.language === 'zh' ? '今天' : 'Today'}
              </span>
            )}
          </span>
          <button
            onClick={handleNextDay}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Calories Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center"
        >
          <CircularProgress
            value={totalCalories}
            max={dailyCalorieGoal}
            size={200}
            strokeWidth={14}
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalCalories}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('dashboard.consumed')}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {remaining}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('dashboard.remaining')} / {dailyCalorieGoal}
                </p>
              </div>
            </div>
          </CircularProgress>
        </motion.div>

        {/* Macro Cards */}
        <div className="grid grid-cols-3 gap-3">
          <MacroCard
            type="carbs"
            current={macros.carbs}
            goal={macroGoals.carbs}
            delay={0.1}
          />
          <MacroCard
            type="protein"
            current={macros.protein}
            goal={macroGoals.protein}
            delay={0.2}
          />
          <MacroCard
            type="fat"
            current={macros.fat}
            goal={macroGoals.fat}
            delay={0.3}
          />
        </div>

        {/* Meal Sections */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {t('dashboard.todayRecord')}
            </h2>
          </div>
          
          <MealSection
            type="breakfast"
            entries={meals.breakfast}
            onAdd={handleAddFood}
            onDelete={removeMealEntry}
            delay={0.4}
          />
          <MealSection
            type="lunch"
            entries={meals.lunch}
            onAdd={handleAddFood}
            onDelete={removeMealEntry}
            delay={0.5}
          />
          <MealSection
            type="dinner"
            entries={meals.dinner}
            onAdd={handleAddFood}
            onDelete={removeMealEntry}
            delay={0.6}
          />
          <MealSection
            type="snack"
            entries={meals.snack}
            onAdd={handleAddFood}
            onDelete={removeMealEntry}
            delay={0.7}
          />
        </div>
      </main>
    </div>
  );
}
