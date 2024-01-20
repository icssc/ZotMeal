export type Nutrition = {
<<<<<<< HEAD:packages/shared/lib/zotmeal.types.ts
  calcium: number;
  calories: number;
  caloriesFromFat: number;
  cholesterol: number;
  dietaryFiber: number;
  iron: number;
  isEatWell: boolean;
  isPlantForward: boolean;
  isVegan: boolean;
  isVegetarian: boolean;
  isWholeGrain: boolean;
  protein: number;
  saturatedFat: number;
  servingSize: number;
  servingUnit: string;
  sodium: number;
  sugars: number;
  totalCarbohydrates: number;
  totalFat: number;
  transFat: number;
  vitaminC: number;
};
=======
    calcium: string
    calories: string
    caloriesFromFat: string
    cholesterol: string
    dietaryFiber: string
    iron: string
    isEatWell: boolean
    isPlantForward: boolean
    isVegan: boolean
    isVegetarian: boolean
    isWholeGrain: boolean
    protein: string
    saturatedFat: string
    servingSize: string
    servingUnit: string
    sodium: string
    sugars: string
    totalCarbohydrates: string
    totalFat: string
    transFat: string
    vitaminC: string
}
>>>>>>> 39893cba6c92671417e7892eef7ef26d1b35f87a:packages/shared/lib/zotmeal.d.ts

export type ItemInfo = {
  description: string;
  name: string;
  nutrition: Nutrition;
};

export type MenuInfo = {
  category: string;
  items: ItemInfo[];
};

export type StationInfo = {
  menu: MenuInfo[];
  station: string;
};

export type LocationInfo = {
<<<<<<< HEAD:packages/shared/lib/zotmeal.types.ts
  all: StationInfo[];
  currentMeal: string;
  date: string;
  restaurant: string;
  price: { [key: string]: number };
  schedule: { [key: string]: { start: number; end: number } };
};
=======
    all: StationInfo[]
    currentMeal: string
    date: string
    restaurant: string
    price: { [key: string]: number }
    schedule: { [key: string]: { start: number, end: number } }
}
>>>>>>> 39893cba6c92671417e7892eef7ef26d1b35f87a:packages/shared/lib/zotmeal.d.ts
