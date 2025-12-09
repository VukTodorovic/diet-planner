import type { Meal, MealItem, PlanOption } from '../types';

export const calculateItemCalories = (item: MealItem): number => {
  return item.quantity * item.food.calories;
};

export const calculateMealCalories = (meal: Meal): number => {
  return meal.items.reduce((total, item) => total + calculateItemCalories(item), 0);
};

export const calculateOptionCalories = (option: PlanOption): number => {
  return option.meals.reduce((total, meal) => total + calculateMealCalories(meal), 0);
};
