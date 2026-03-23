export interface Food {
  id: string;
  name: {
    zh: string;
    en: string;
  };
  category: FoodCategory;
  calories: number;
  macros: {
    carbs: number;
    protein: number;
    fat: number;
    fiber?: number;
    sodium?: number;
  };
  unit: string;
  image?: string;
}

export type FoodCategory = 
  | 'staple' 
  | 'meat' 
  | 'vegetable' 
  | 'fruit' 
  | 'snack' 
  | 'beverage';

export interface MealEntry {
  id: string;
  date: string;
  mealType: MealType;
  foodId: string;
  food: Food;
  quantity: number;
  unit: string;
  totalCalories: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  dailyCalorieGoal: number;
  macroGoals: {
    carbs: number;
    protein: number;
    fat: number;
  };
  preferences: {
    language: 'zh' | 'en';
    theme: 'light' | 'dark' | 'system';
  };
  streak: number;
}

export interface DailyStats {
  date: string;
  totalCalories: number;
  macros: {
    carbs: number;
    protein: number;
    fat: number;
  };
  meals: {
    breakfast: MealEntry[];
    lunch: MealEntry[];
    dinner: MealEntry[];
    snack: MealEntry[];
  };
}

export interface WeeklyData {
  week: string;
  days: {
    date: string;
    dayName: string;
    calories: number;
    goal: number;
  }[];
}
