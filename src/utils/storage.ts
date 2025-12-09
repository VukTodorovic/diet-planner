import type { DietPlan } from '../types';

const STORAGE_KEY = 'diet_planner_plans';

export const getPlans = (): DietPlan[] => {
  const plansJSON = localStorage.getItem(STORAGE_KEY);
  if (!plansJSON) return [];
  
  const plans: any[] = JSON.parse(plansJSON);
  
  // Migration: Convert old plans with 'meals' to new plans with 'options'
  return plans.map(plan => {
    if (plan.meals && !plan.options) {
      return {
        ...plan,
        options: [
          {
            id: 'default-option',
            name: 'Option 1',
            meals: plan.meals
          }
        ],
        meals: undefined // Remove old property
      };
    }
    return plan;
  });
};

export const savePlan = (plan: DietPlan): void => {
  const plans = getPlans();
  const index = plans.findIndex((p) => p.id === plan.id);
  if (index >= 0) {
    plans[index] = plan;
  } else {
    plans.push(plan);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
};

export const deletePlan = (id: string): void => {
  const plans = getPlans();
  const newPlans = plans.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlans));
};

export const getPlan = (id: string): DietPlan | undefined => {
  const plans = getPlans();
  return plans.find((p) => p.id === id);
};
