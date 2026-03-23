'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/stores/app-store';
import { SearchBar } from '@/components/search-bar';
import { CategoryFilter } from '@/components/category-filter';
import { FoodCard } from '@/components/food-card';
import { Food, MealType } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function SearchPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user, searchFoods, addMealEntry, selectedDate } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState(100);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(user.preferences.language);
  }, [i18n, user.preferences.language]);

  const searchResults = searchFoods(searchQuery, selectedCategory);

  const handleFoodClick = (food: Food) => {
    setSelectedFood(food);
    setQuantity(100);
    setShowAddDialog(true);
  };

  const handleAddFood = () => {
    if (!selectedFood) return;

    addMealEntry({
      date: selectedDate,
      mealType: selectedMealType,
      foodId: selectedFood.id,
      quantity,
      unit: selectedFood.unit,
    });

    setShowAddDialog(false);
    setSelectedFood(null);
  };

  const language = user.preferences.language;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-800 px-4 py-4 border-b border-gray-100 dark:border-slate-700">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('nav.search')}
        </h1>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          autoFocus
        />
        <div className="mt-3">
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </header>

      {/* Results */}
      <main className="p-4">
        <AnimatePresence mode="wait">
          {searchResults.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {searchResults.map((food, index) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  index={index}
                  showAdd={true}
                  onAdd={handleFoodClick}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 dark:text-gray-400">
                {t('search.noResults')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Food Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {language === 'zh' ? '添加食物' : 'Add Food'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedFood && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-2xl">
                  {selectedFood.category === 'staple' && '🍚'}
                  {selectedFood.category === 'meat' && '🥩'}
                  {selectedFood.category === 'vegetable' && '🥬'}
                  {selectedFood.category === 'fruit' && '🍎'}
                  {selectedFood.category === 'snack' && '🍪'}
                  {selectedFood.category === 'beverage' && '🥤'}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedFood.name[language]}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedFood.calories} kcal / 100{selectedFood.unit}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  {t('food.selectMeal')}
                </label>
                <Select
                  value={selectedMealType}
                  onValueChange={(value) => setSelectedMealType(value as MealType)}
                >
                  <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
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

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  {t('food.quantity')} ({selectedFood.unit})
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(10, quantity - 10))}
                    className="dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="text-center dark:bg-slate-800 dark:border-slate-700"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 10)}
                    className="dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'zh' ? '预计热量' : 'Estimated Calories'}
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {Math.round(selectedFood.calories * (quantity / 100))} kcal
                  </span>
                </div>
              </div>

              <Button
                onClick={handleAddFood}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                {language === 'zh' ? '确认添加' : 'Add Food'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
