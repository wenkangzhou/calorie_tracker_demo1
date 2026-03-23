'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Flame, Calendar, TrendingUp, Target, Award } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { CircularProgress } from '@/components/circular-progress';
import { WeeklyChart } from '@/components/weekly-chart';
import { StatCard } from '@/components/stat-card';

export default function ProgressPage() {
  const { t, i18n } = useTranslation();
  const { user, mealEntries, selectedDate, getDailyStats } = useAppStore();

  useEffect(() => {
    i18n.changeLanguage(user.preferences.language);
  }, [i18n, user.preferences.language]);

  const language = user.preferences.language;

  // Calculate stats
  const uniqueDates = [...new Set(mealEntries.map((e) => e.date))];
  const totalDays = uniqueDates.length;
  
  const avgCalories = totalDays > 0
    ? Math.round(mealEntries.reduce((sum, e) => sum + e.totalCalories, 0) / totalDays)
    : 0;

  const currentStats = getDailyStats();
  const todayProgress = Math.min((currentStats.totalCalories / user.dailyCalorieGoal) * 100, 100);

  // Calculate streak
  let streak = user.streak;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 px-4 py-4 border-b border-gray-100 dark:border-slate-700">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('progress.title')}
        </h1>
      </header>

      <main className="p-4 space-y-4">
        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700"
        >
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 text-center">
            {t('progress.overall')}
          </h2>
          <div className="flex justify-center">
            <CircularProgress
              value={currentStats.totalCalories}
              max={user.dailyCalorieGoal}
              size={160}
              strokeWidth={12}
            >
              <div className="text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="text-4xl font-bold text-gray-900 dark:text-white"
                >
                  {Math.round(todayProgress)}
                </motion.span>
                <span className="text-lg text-gray-500 dark:text-gray-400">%</span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('progress.dailyGoal')}
                </p>
              </div>
            </CircularProgress>
          </div>
        </motion.div>

        {/* Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">{t('progress.streak')}</p>
              <div className="flex items-baseline gap-1">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="text-5xl font-bold"
                >
                  {streak}
                </motion.span>
                <span className="text-orange-100">{t('progress.days')}</span>
              </div>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Calendar}
            value={totalDays}
            label={t('progress.totalDays')}
            color="blue"
            delay={0.2}
          />
          <StatCard
            icon={TrendingUp}
            value={avgCalories}
            label={t('progress.avgCalories')}
            suffix=""
            color="green"
            delay={0.3}
          />
          <StatCard
            icon={Award}
            value={7}
            label={t('progress.bestWeek')}
            color="amber"
            delay={0.4}
          />
          <StatCard
            icon={Target}
            value={2}
            label={t('progress.weightLoss')}
            suffix="kg"
            color="rose"
            delay={0.5}
          />
        </div>

        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <WeeklyChart />
        </motion.div>

        {/* Motivation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-900/30"
        >
          <p className="text-sm text-green-800 dark:text-green-300 text-center">
            {language === 'zh'
              ? '🎉 太棒了！你已经连续记录了12天，继续保持！'
              : '🎉 Great job! You have logged for 12 days in a row, keep it up!'}
          </p>
        </motion.div>
      </main>
    </div>
  );
}
