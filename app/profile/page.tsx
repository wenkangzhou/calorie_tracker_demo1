'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  User,
  Target,
  Bell,
  Palette,
  Globe,
  Cloud,
  Info,
  ChevronRight,
  Moon,
  Sun,
  Smartphone,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Theme = 'light' | 'dark' | 'system';

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { user, setUser, setLanguage, setTheme } = useAppStore();
  
  const [editGoalOpen, setEditGoalOpen] = useState(false);
  const [tempGoal, setTempGoal] = useState(user.dailyCalorieGoal);

  useEffect(() => {
    i18n.changeLanguage(user.preferences.language);
  }, [i18n, user.preferences.language]);

  const language = user.preferences.language;
  const theme = user.preferences.theme;

  const handleLanguageChange = (value: string | null) => {
    if (value) {
      const lang = value as 'zh' | 'en';
      setLanguage(lang);
      i18n.changeLanguage(lang);
    }
  };

  const handleThemeChange = (value: string | null) => {
    if (value) setTheme(value as Theme);
  };

  const handleGoalSave = () => {
    setUser({ dailyCalorieGoal: tempGoal });
    setEditGoalOpen(false);
  };

  const settingsItems = [
    {
      icon: Target,
      label: t('profile.goals'),
      value: `${user.dailyCalorieGoal} kcal`,
      onClick: () => setEditGoalOpen(true),
    },
    {
      icon: Bell,
      label: t('profile.notifications'),
      rightElement: <Switch />,
    },
    {
      icon: Palette,
      label: t('profile.theme'),
      rightElement: (
        <Select value={theme} onValueChange={handleThemeChange}>
          <SelectTrigger className="w-32 h-8 text-xs border-0 bg-transparent dark:text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Light
              </div>
            </SelectItem>
            <SelectItem value="dark">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Dark
              </div>
            </SelectItem>
            <SelectItem value="system">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                System
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      icon: Globe,
      label: t('profile.language'),
      rightElement: (
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-32 h-8 text-xs border-0 bg-transparent dark:text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zh">中文</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      icon: Cloud,
      label: t('profile.dataSync'),
      value: language === 'zh' ? '已同步' : 'Synced',
    },
    {
      icon: Info,
      label: t('profile.about'),
      value: 'v1.0.0',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 px-4 py-4 border-b border-gray-100 dark:border-slate-700">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('profile.title')}
        </h1>
      </header>

      <main className="p-4 space-y-4">
        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
              👤
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-green-100 text-sm mt-1">
                {language === 'zh' ? '免费用户' : 'Free User'}
              </p>
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-2xl font-bold">{user.streak}</p>
              <p className="text-xs text-green-100">
                {language === 'zh' ? '连续天数' : 'Streak'}
              </p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-green-100">
                {language === 'zh' ? '总记录天数' : 'Total Days'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Settings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden"
        >
          {settingsItems.map((item, index) => (
            <div
              key={item.label}
              onClick={item.onClick}
              className={`flex items-center justify-between p-4 ${
                index !== settingsItems.length - 1
                  ? 'border-b border-gray-100 dark:border-slate-700'
                  : ''
              } ${item.onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.value}
                  </span>
                )}
                {item.rightElement ? (
                  item.rightElement
                ) : item.onClick ? (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                ) : null}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Version */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
          CalorieTracker v1.0.0
        </p>
      </main>

      {/* Edit Goal Dialog */}
      <Dialog open={editGoalOpen} onOpenChange={setEditGoalOpen}>
        <DialogContent className="dark:bg-slate-800 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {t('profile.dailyCalorieGoal')}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
              {language === 'zh' ? '每日热量目标 (kcal)' : 'Daily Calorie Goal (kcal)'}
            </label>
            <Input
              type="number"
              value={tempGoal}
              onChange={(e) => setTempGoal(Number(e.target.value))}
              className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1 dark:border-slate-600 dark:text-white"
                onClick={() => setEditGoalOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                onClick={handleGoalSave}
              >
                {t('common.save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
