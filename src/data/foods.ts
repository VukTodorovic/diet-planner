export interface Food {
  name: string;
  unit: 'piece' | '100g';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const foods: Food[] = [
  {
    name: "Kuvano jaje",
    unit: "piece",
    calories: 72,
    protein: 6.3,
    carbs: 0.3,
    fat: 5.3
  },
  {
    name: "Belance (kokosje)",
    unit: "piece",
    calories: 17,
    protein: 4,
    carbs: 0,
    fat: 0.2
  },
  {
    name: "Maslinovo ulje",
    unit: "100g",
    calories: 824,
    protein: 0.1,
    carbs: 0,
    fat: 91.6
  },
  {
    name: "Pilece belo meso",
    unit: "100g",
    calories: 120,
    protein: 22.5,
    carbs: 0,
    fat: 2.62
  },
  {
    name: "Prsuta (svinjska)",
    unit: "100g",
    calories: 252,
    protein: 30,
    carbs: 0,
    fat: 14.4
  },
  {
    name: "Junetina (govedina)",
    unit: "100g",
    calories: 214,
    protein: 18.8,
    carbs: 0,
    fat: 15.4
  },
  {
    name: "Pileci batak",
    unit: "100g",
    calories: 184,
    protein: 24.2,
    carbs: 0,
    fat: 9
  },
  {
    name: "Svinjski but",
    unit: "100g",
    calories: 297,
    protein: 25.7,
    carbs: 0,
    fat: 20.8
  },
  {
    name: "Pecenica",
    unit: "100g",
    calories: 121,
    protein: 15,
    carbs: 2.2,
    fat: 6
  },
  {
    name: "Ella sir",
    unit: "100g",
    calories: 55,
    protein: 12,
    carbs: 1,
    fat: 0
  },
  {
    name: "cureca prsa",
    unit: "100g",
    calories: 101,
    protein: 20,
    carbs: 3,
    fat: 1
  },
  {
    name: "pileca prsa",
    unit: "100g",
    calories: 128,
    protein: 19.3,
    carbs: 1,
    fat: 5.9
  },
  {
    name: "Whey Protein",
    unit: "100g",
    calories: 393.9,
    protein: 76,
    carbs: 12.2,
    fat: 4.55
  },
  {
    name: "Edamer sir",
    unit: "100g",
    calories: 357,
    protein: 25,
    carbs: 1.43,
    fat: 27.8
  },
  {
    name: "Gauda (gouda) sir",
    unit: "100g",
    calories: 356,
    protein: 25,
    carbs: 2.2,
    fat: 27.44
  },
  {
    name: "Jogurt 2,8% mm",
    unit: "100g",
    calories: 52.8,
    protein: 2.9,
    carbs: 4,
    fat: 2.8
  },
  {
    name: "Jogurt voćni, breskva, Zott",
    unit: "100g",
    calories: 91,
    protein: 3.5,
    carbs: 12.2,
    fat: 2.7
  },
  {
    name: "Kackavalj",
    unit: "100g",
    calories: 389,
    protein: 0,
    carbs: 25,
    fat: 32
  },
  {
    name: "Kisela pavlaka, 20% mm",
    unit: "100g",
    calories: 206,
    protein: 2.7,
    carbs: 3.9,
    fat: 20
  },
  {
    name: "Mleko, kravlje 2,8% mm",
    unit: "100g",
    calories: 56,
    protein: 3.1,
    carbs: 4.5,
    fat: 2.8
  },
  {
    name: "Mleko kiselo, 2,8% mm",
    unit: "100g",
    calories: 54,
    protein: 3,
    carbs: 3.6,
    fat: 2.8
  },
  {
    name: "Mlecni napitak, Protein, Imlek",
    unit: "100g",
    calories: 55,
    protein: 10,
    carbs: 3.6,
    fat: 0.05
  },
  {
    name: "Mliječni napitak, Protein, Zbregov",
    unit: "100g",
    calories: 62,
    protein: 10,
    carbs: 4.7,
    fat: 0.4
  },
  {
    name: "Puding proteinski, Zbregov",
    unit: "100g",
    calories: 81,
    protein: 10,
    carbs: 6.4,
    fat: 2
  },
  {
    name: "Sir, feta",
    unit: "100g",
    calories: 263,
    protein: 14.21,
    carbs: 4.2,
    fat: 21.32
  },
  {
    name: "Sir, mladi President Dukat",
    unit: "100g",
    calories: 115.5,
    protein: 12.5,
    carbs: 4,
    fat: 5.5
  },
  {
    name: "Kukuruzne pahuljice (cornflakes)",
    unit: "100g",
    calories: 357,
    protein: 7.5,
    carbs: 84.1,
    fat: 4
  },
  {
    name: "Pahuljice (sitne), zobene, ovsene",
    unit: "100g",
    calories: 373,
    protein: 13,
    carbs: 68,
    fat: 7
  },
  {
    name: "Pasta, testenina, integralna",
    unit: "100g",
    calories: 352,
    protein: 13.87,
    carbs: 73,
    fat: 2.9
  },
  {
    name: "Pirinac, riza, belo zrno, sirovo",
    unit: "100g",
    calories: 352,
    protein: 7.1,
    carbs: 78.6,
    fat: 0.5
  },
  {
    name: "Tortilja Mexicana, Fit",
    unit: "100g",
    calories: 356.8,
    protein: 10.6,
    carbs: 57,
    fat: 8.1
  },
  {
    name: "Tost, psenicno brasno",
    unit: "100g",
    calories: 313,
    protein: 12.96,
    carbs: 55.7,
    fat: 4.27
  },
  {
    name: "Hleb, integralni",
    unit: "100g",
    calories: 274,
    protein: 9.2,
    carbs: 43.2,
    fat: 5.5
  },
  {
    name: "Palenta",
    unit: "100g",
    calories: 349.36,
    protein: 7,
    carbs: 79,
    fat: 2
  },
  {
    name: "Pecivo (bijelo brašno)",
    unit: "100g",
    calories: 256,
    protein: 8,
    carbs: 47,
    fat: 4
  },
  {
    name: "Psenicni griz",
    unit: "100g",
    calories: 333,
    protein: 11,
    carbs: 70,
    fat: 1
  },
  {
    name: "Tonus hleb",
    unit: "100g",
    calories: 187,
    protein: 8.2,
    carbs: 43,
    fat: 1.4
  },
  {
    name: "Batat (slatki krompir)",
    unit: "100g",
    calories: 86,
    protein: 1.57,
    carbs: 20,
    fat: 0.05
  },
  {
    name: "Grasak zeleni (u zrnu), smrznuti",
    unit: "100g",
    calories: 77,
    protein: 5.22,
    carbs: 13.6,
    fat: 0.4
  },
  {
    name: "Krompir (krumpir)",
    unit: "100g",
    calories: 87,
    protein: 2,
    carbs: 20,
    fat: 0.09
  },
  {
    name: "Carska mesavina, smrznuto povrce",
    unit: "100g",
    calories: 32,
    protein: 2,
    carbs: 4,
    fat: 0.5
  },
  {
    name: "Badem (suvi, przeni, bez soli)",
    unit: "100g",
    calories: 597,
    protein: 22.26,
    carbs: 19.44,
    fat: 53
  },
  {
    name: "Banana",
    unit: "100g",
    calories: 89,
    protein: 1.09,
    carbs: 22.84,
    fat: 0.33
  },
  {
    name: "Jabuka",
    unit: "100g",
    calories: 58,
    protein: 0.44,
    carbs: 13.9,
    fat: 0.19
  },
  {
    name: "Kikiriki, suvo-peceni, bez soli (sve vrste)",
    unit: "100g",
    calories: 587,
    protein: 24.35,
    carbs: 21.26,
    fat: 49.66
  },
  {
    name: "Sumsko voce, smrznuto",
    unit: "100g",
    calories: 57,
    protein: 1.1,
    carbs: 11,
    fat: 0.9
  },
  {
    name: "Pastrmka",
    unit: "100g",
    calories: 195,
    protein: 21.5,
    carbs: 0,
    fat: 11.4
  },
  {
    name: "Oslic",
    unit: "100g",
    calories: 71,
    protein: 17,
    carbs: 0.1,
    fat: 0.3
  },
  {
    name: "Tunjevina,komadi, konzerva u sopstenom sosu",
    unit: "piece",
    calories: 316,
    protein: 22,
    carbs: 0.1,
    fat: 25.6
  }
];

