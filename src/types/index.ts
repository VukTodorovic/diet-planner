import type { Food } from '../data/foods';
export type { Food };

export interface MealItem {
  id: string;
  food: Food;
  quantity: number; // Multiplier of the unit (e.g., 2 x piece, 3.5 x 100g)
}

export interface Meal {
  id: string;
  name: string;
  items: MealItem[];
  note?: string;
}

export interface PlanOption {
  id: string;
  name: string;
  meals: Meal[];
  note?: string;
}

export interface DietPlan {
  id: string;
  name: string;
  createdAt: string;
  options: PlanOption[];
  note?: string;
}
