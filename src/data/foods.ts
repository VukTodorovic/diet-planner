export interface Food {
  name: string;
  unit: 'piece' | '100g';
  calories: number;
}

export const foods: Food[] = [
  {
    name: "apple",
    unit: "piece",
    calories: 95
  },
  {
    name: "banana",
    unit: "piece",
    calories: 105
  },
  {
    name: "oats (dry)",
    unit: "100g",
    calories: 385
  },
  {
    name: "rice (uncooked)",
    unit: "100g",
    calories: 130
  },
  {
    name: "chicken breast (raw)",
    unit: "100g",
    calories: 165
  },
  {
    name: "egg",
    unit: "piece",
    calories: 70
  },
  {
    name: "milk (whole)",
    unit: "100g",
    calories: 60
  },
  {
    name: "bread (slice)",
    unit: "piece",
    calories: 80
  },
  {
    name: "potato (raw)",
    unit: "100g",
    calories: 77
  },
  {
    name: "olive oil",
    unit: "100g",
    calories: 884
  }
];
