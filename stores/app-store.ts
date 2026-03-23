'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Food, MealEntry, MealType, User } from '@/types';
import { foodsData } from '@/lib/foods-data';
import { format } from 'date-fns';

interface AppState {
  user: User;
  selectedDate: string;
  mealEntries: MealEntry[];
  foods: Food[];
  
  // Actions
  setUser: (user: Partial<User>) => void;
  setSelectedDate: (date: string) => void;
  addMealEntry: (entry: Omit<MealEntry, 'id' | 'totalCalories' | 'food'>) => void;
  removeMealEntry: (id: string) => void;
  setLanguage: (lang: 'zh' | 'en') => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Getters
  getDailyStats: (date?: string) => {
    totalCalories: number;
    macros: { carbs: number; protein: number; fat: number };
    meals: Record<MealType, MealEntry[]>;
  };
  getFoodById: (id: string) => Food | undefined;
  searchFoods: (query: string, category?: string) => Food[];
}

const defaultUser: User = {
  id: '1',
  name: 'User',
  dailyCalorieGoal: 1200,
  macroGoals: { carbs: 150, protein: 60, fat: 40 },
  preferences: { language: 'zh', theme: 'system' },
  streak: 12,
};

// Generate sample meal entries for today and yesterday
const generateSampleEntries = (): MealEntry[] => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
  
  const entries: MealEntry[] = [
    // Today's entries
    {
      id: '1',
      date: today,
      mealType: 'breakfast',
      foodId: '4',
      food: foodsData.find(f => f.id === '4')!,
      quantity: 50,
      unit: 'g',
      totalCalories: Math.round(389 * 0.5),
    },
    {
      id: '2',
      date: today,
      mealType: 'breakfast',
      foodId: '33',
      food: foodsData.find(f => f.id === '33')!,
      quantity: 250,
      unit: 'ml',
      totalCalories: Math.round(54 * 2.5),
    },
    {
      id: '3',
      date: today,
      mealType: 'lunch',
      foodId: '1',
      food: foodsData.find(f => f.id === '1')!,
      quantity: 150,
      unit: 'g',
      totalCalories: Math.round(130 * 1.5),
    },
    {
      id: '4',
      date: today,
      mealType: 'lunch',
      foodId: '9',
      food: foodsData.find(f => f.id === '9')!,
      quantity: 120,
      unit: 'g',
      totalCalories: Math.round(165 * 1.2),
    },
    {
      id: '5',
      date: today,
      mealType: 'lunch',
      foodId: '16',
      food: foodsData.find(f => f.id === '16')!,
      quantity: 100,
      unit: 'g',
      totalCalories: 34,
    },
    {
      id: '6',
      date: today,
      mealType: 'snack',
      foodId: '24',
      food: foodsData.find(f => f.id === '24')!,
      quantity: 150,
      unit: 'g',
      totalCalories: Math.round(52 * 1.5),
    },
    // Yesterday's entries
    {
      id: '7',
      date: yesterday,
      mealType: 'breakfast',
      foodId: '5',
      food: foodsData.find(f => f.id === '5')!,
      quantity: 60,
      unit: 'g',
      totalCalories: Math.round(247 * 0.6),
    },
    {
      id: '8',
      date: yesterday,
      mealType: 'lunch',
      foodId: '2',
      food: foodsData.find(f => f.id === '2')!,
      quantity: 200,
      unit: 'g',
      totalCalories: Math.round(137 * 2),
    },
  ];
  
  return entries;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      selectedDate: format(new Date(), 'yyyy-MM-dd'),
      mealEntries: generateSampleEntries(),
      foods: foodsData,
      
      setUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
      
      setSelectedDate: (date) => set({ selectedDate: date }),
      
      addMealEntry: (entry) => {
        const food = get().foods.find(f => f.id === entry.foodId);
        if (!food) return;
        
        const totalCalories = Math.round(food.calories * (entry.quantity / 100));
        
        const newEntry: MealEntry = {
          ...entry,
          id: Date.now().toString(),
          totalCalories,
          food,
        };
        
        set((state) => ({
          mealEntries: [...state.mealEntries, newEntry]
        }));
      },
      
      removeMealEntry: (id) => set((state) => ({
        mealEntries: state.mealEntries.filter(e => e.id !== id)
      })),
      
      setLanguage: (lang) => set((state) => ({
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, language: lang }
        }
      })),
      
      setTheme: (theme) => set((state) => ({
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, theme }
        }
      })),
      
      getDailyStats: (date) => {
        const targetDate = date || get().selectedDate;
        const entries = get().mealEntries.filter(e => e.date === targetDate);
        
        const meals: Record<MealType, MealEntry[]> = {
          breakfast: entries.filter(e => e.mealType === 'breakfast'),
          lunch: entries.filter(e => e.mealType === 'lunch'),
          dinner: entries.filter(e => e.mealType === 'dinner'),
          snack: entries.filter(e => e.mealType === 'snack'),
        };
        
        const totalCalories = entries.reduce((sum, e) => sum + e.totalCalories, 0);
        
        const macros = entries.reduce(
          (acc, e) => {
            const ratio = e.quantity / 100;
            acc.carbs += (e.food.macros.carbs * ratio);
            acc.protein += (e.food.macros.protein * ratio);
            acc.fat += (e.food.macros.fat * ratio);
            return acc;
          },
          { carbs: 0, protein: 0, fat: 0 }
        );
        
        return {
          totalCalories,
          macros: {
            carbs: Math.round(macros.carbs),
            protein: Math.round(macros.protein),
            fat: Math.round(macros.fat),
          },
          meals,
        };
      },
      
      getFoodById: (id) => get().foods.find(f => f.id === id),
      
      searchFoods: (query, category) => {
        const { language } = get().user.preferences;
        let results = get().foods;
        
        if (category && category !== 'all') {
          results = results.filter(f => f.category === category);
        }
        
        if (query) {
          const lowerQuery = query.toLowerCase();
          results = results.filter(f => {
            const name = language === 'zh' ? f.name.zh : f.name.en;
            return name.toLowerCase().includes(lowerQuery);
          });
        }
        
        return results;
      },
    }),
    {
      name: 'calorie-tracker-storage',
      partialize: (state) => ({ 
        user: state.user, 
        mealEntries: state.mealEntries 
      }),
    }
  )
);
