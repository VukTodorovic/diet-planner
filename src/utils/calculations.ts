import type { Meal, MealItem, PlanOption } from '../types';

export const calculateItemCalories = (item: MealItem): number => {
  return item.quantity * item.food.calories;
};

export const calculateItemMacros = (item: MealItem) => {
  return {
    protein: item.quantity * item.food.protein,
    carbs: item.quantity * item.food.carbs,
    fat: item.quantity * item.food.fat,
  };
};

export const calculateMealCalories = (meal: Meal): number => {
  return meal.items.reduce((total, item) => total + calculateItemCalories(item), 0);
};

export const calculateMealMacros = (meal: Meal) => {
  return meal.items.reduce(
    (total, item) => {
      const macros = calculateItemMacros(item);
      return {
        protein: total.protein + macros.protein,
        carbs: total.carbs + macros.carbs,
        fat: total.fat + macros.fat,
      };
    },
    { protein: 0, carbs: 0, fat: 0 }
  );
};

export const calculateOptionCalories = (option: PlanOption): number => {
  return option.meals.reduce((total, meal) => total + calculateMealCalories(meal), 0);
};

export const calculateOptionMacros = (option: PlanOption) => {
  return option.meals.reduce(
    (total, meal) => {
      const macros = calculateMealMacros(meal);
      return {
        protein: total.protein + macros.protein,
        carbs: total.carbs + macros.carbs,
        fat: total.fat + macros.fat,
      };
    },
    { protein: 0, carbs: 0, fat: 0 }
  );
};
