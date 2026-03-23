'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MealType } from '@/types';

const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

const categoryIcons: Record<string, string> = {
  staple: '🍚',
  meat: '🥩',
  vegetable: '🥬',
  fruit: '🍎',
  snack: '🍪',
  beverage: '🥤',
};

interface FoodDetailClientProps {
  id: string;
}

export default function FoodDetailClient({ id }: FoodDetailClientProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user, foods, addMealEntry, selectedDate } = useAppStore();
  
  const [quantity, setQuantity] = useState(100);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(user.preferences.language);
  }, [i18n, user.preferences.language]);

  const food = foods.find((f) => f.id === id);

  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <p className="text-gray-500 dark:text-gray-400">
          {user.preferences.language === 'zh' ? '食物未找到' : 'Food not found'}
        </p>
      </div>
    );
  }

  const language = user.preferences.language;

  const handleAddFood = () => {
    addMealEntry({
      date: selectedDate,
      mealType: selectedMealType,
      foodId: food.id,
      quantity,
      unit: food.unit,
    });
    router.push('/');
  };

  const calculatedCalories = Math.round(food.calories * (quantity / 100));
  const calculatedMacros = {
    carbs: Math.round(food.macros.carbs * (quantity / 100)),
    protein: Math.round(food.macros.protein * (quantity / 100)),
    fat: Math.round(food.macros.fat * (quantity / 100)),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24">
      {/* Header Image */}
      <div className="relative h-64 bg-gradient-to-br from-green-400 to-green-600">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl">{categoryIcons[food.category]}</span>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative -mt-6 bg-white dark:bg-slate-800 rounded-t-3xl px-4 py-6 min-h-[calc(100vh-16rem)]"
      >
        {/* Food Name */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {food.name[language]}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {food.calories} kcal / 100{food.unit}
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            {t('food.quantity')} ({food.unit})
          </label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(10, quantity - 10))}
              className="dark:border-slate-600 dark:hover:bg-slate-700"
            >
              -
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="text-center text-lg font-semibold dark:bg-slate-700 dark:border-slate-600"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 10)}
              className="dark:border-slate-600 dark:hover:bg-slate-700"
            >
              +
            </Button>
          </div>
          <div className="mt-3 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'zh' ? '预计热量: ' : 'Estimated: '}
            </span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {calculatedCalories} kcal
            </span>
          </div>
        </div>

        {/* Nutrition Facts */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('food.nutritionFacts')}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">
                {t('food.carbs')}
              </p>
              <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                {calculatedMacros.carbs}g
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                {t('food.protein')}
              </p>
              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                {calculatedMacros.protein}g
              </p>
            </div>
            <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4">
              <p className="text-xs text-rose-600 dark:text-rose-400 mb-1">
                {t('food.fat')}
              </p>
              <p className="text-xl font-bold text-rose-700 dark:text-rose-300">
                {calculatedMacros.fat}g
              </p>
            </div>
            {food.macros.fiber !== undefined && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <p className="text-xs text-green-600 dark:text-green-400 mb-1">
                  {t('food.fiber')}
                </p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">
                  {Math.round(food.macros.fiber * (quantity / 100))}g
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Meal Type Selector */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            {t('food.selectMeal')}
          </label>
          <Select
            value={selectedMealType}
            onValueChange={(value) => setSelectedMealType(value as MealType)}
          >
            <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mealTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`meal.${type}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-20 left-0 right-0 px-4 max-w-md mx-auto">
        <Button
          onClick={handleAddFood}
          className="w-full h-12 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-xl shadow-lg"
        >
          {language === 'zh' ? '添加到' : 'Add to'} {t(`meal.${selectedMealType}`)}
        </Button>
      </div>
    </div>
  );
}
