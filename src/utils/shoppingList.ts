import type { DietPlan, Food } from '../types';

export interface ShoppingListItem {
  food: Food;
  totalQuantity: number;
}

export const calculateShoppingList = (plan: DietPlan): ShoppingListItem[] => {
  const totals = new Map<string, { food: Food; quantity: number }>();

  plan.options.forEach((option) => {
    option.meals.forEach((meal) => {
      meal.items.forEach((item) => {
        const existing = totals.get(item.food.name);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          totals.set(item.food.name, {
            food: item.food,
            quantity: item.quantity,
          });
        }
      });
    });
  });

  return Array.from(totals.values())
    .sort((a, b) => a.food.name.localeCompare(b.food.name))
    .map((item) => ({
      food: item.food,
      totalQuantity: item.quantity,
    }));
};
