import { Drumstick, EggFried, LucideProps, Pizza, Salad, Soup, Sandwich, IceCreamBowl, Dessert, Cookie, Croissant, CakeSlice, Wheat, Apple, FishSymbol} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

enum StatusColors {
    OPEN = "bg-emerald-500",
    CLOSED = "bg-red-500",
    ERROR = "bg-amber-500"
};

enum HallStatusEnum {
    OPEN,
    CLOSED,
    ERROR
};

enum HallEnum {
    ANTEATERY,
    BRANDYWINE
};

enum MealTimeEnum {
    BREAKFAST,
    LUNCH,
    DINNER,
    LATENIGHT
}


const nutrientToUnit : { [nutrient: string]: string } = {
  "calories": "cal",
  "totalFatG": "g",
  "transFatG": "g",
  "saturatedFatG": "g",
  "cholesterolMg": "mg",
  "sodiumMg": "mg",
  "totalCarbsG": "g",
  "dietaryFiberG": "g",
  "sugarsMg": "mg",
  "proteinG": "g",
  "vitaminAIU": "% DV",
  "vitaminCIU": "% DV",
  "calciumMg": "mg",
  "ironMg": "mg",
}

const numToMonth : {[num: number]: string} = {
  0:  "Jan.",
  1:  "Feb.",
  2:  "Mar.",
  3:  "Apr.",
  4:  "May",
  5:  "Jun.",
  6:  "Jul.",
  7:  "Aug.",
  8:  "Sep.",
  9:  "Oct.",
  10: "Nov.",
  11: "Dec."
};

// NOTE: Be sure to keep these lowercase.
const preferredCategoryOrder: string[] = [
  'entrées', 
  'hot sandwiches', 
  'cold sandwiches', 
  'pizza',
  'soups',
  'salads', 
  'sides', 
  'protein',
  'cereals',
  'breads',
  'grains',
  'condiments',
  'desserts',
]

let meatKeywords: Set<string> = new Set<string>([
  'chicken',
  'ham',
  'beef',
  'pork',
  'shawarma',
  'turkey',
  'sausage',
  'meat',
  'bacon',
  'salami',
  'pepperoni'
]);

let pastryKeywords: Set<string> = new Set<string>([
  'cinnamon',
  'pastry',
  'muffin'
]);

let fruitKeywords: Set<string> = new Set<string>([
  'strawberr',
  'orange',
  'cranberr',
  'pineapple',
  'grape',
  'cantaloupe',
  'melon'
])

let cookieKeywords: Set<string> = new Set<string>([
  'cookie'
]);

let croissantKeywords: Set<string> = new Set<string>([
  'croissant'
]);

let cakeKeywords: Set<string> = new Set<string>([
  'cake'
]);

let sandwichKeywords: Set<string> = new Set<string>([
  'sandwich',
  'melt',
  'burger',
  'dog',      // meaning hot dog, trust 😵
  'panini'
]);

let pizzaKeywords: Set<string> = new Set<string>([
  'pizza',
  'flatbread',
  'stromboli'
]);

let eggKeywords: Set<string> = new Set<string>([
  'egg',
  'omelette'
]);

let saladKeywords: Set<string> = new Set<string>([
  'tomato',
  'lettuce',
  'onion',
  'greens',
  'coleslaw',
  'kale',
  'olive',
  'pepper',
  'kale',
  'salad',
  'cucumber',
  'spinach',
  'carrot',
  'bean',
  'lentil',
  'tofu',
  'vegetable',
  'potato',
]);

let grainAndBreadKeywords: Set<string> = new Set<string>([
  'bread',
  'farro',
  'crouton',
  'quinoa',
  'oats',
  'granola',
  'bagel'
]);

let soupKeywords: Set<string> = new Set<string>([
  'oatmeal',
  'soup',
  'cereal',
  'mac',
  'rice',
  'noodle',
  'penne',
  'pasta',
  'cavatappi'
]);

let iceCreamKeywords: Set<string> = new Set<string>([
  'cream',
  'yogurt',
  'sorbet',
  'parfait',
]);

let fishKeywords: Set<string> = new Set<string>([
  'fish',
  'tilapia',
  'tuna',
  'salmon'
])

// NOTE: Order matters! We want to go from specific to general, so that 
// something like a "ham"burger, doesn't show up as a drumstick, when a 
// burger icon is more appropriate.
let foodIconKeywords: Set<string>[] = [
  cakeKeywords,
  croissantKeywords,
  cookieKeywords,
  pastryKeywords,
  iceCreamKeywords,
  fruitKeywords,
  soupKeywords,
  eggKeywords,
  pizzaKeywords,
  sandwichKeywords,
  meatKeywords,
  saladKeywords,
  grainAndBreadKeywords,
  fishKeywords,
]

export type LucideIconComponent = 
  ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>;

let foodIcons: LucideIconComponent[] = [
  CakeSlice,
  Croissant,
  Cookie,
  Dessert,
  IceCreamBowl,
  Apple,
  Soup,
  EggFried,
  Pizza,
  Sandwich,
  Drumstick,
  Salad,
  Wheat,
  FishSymbol
];


export {StatusColors, 
        HallStatusEnum, 
        HallEnum, 
        MealTimeEnum, 
        nutrientToUnit,
        numToMonth,
        preferredCategoryOrder,
        foodIconKeywords,
        foodIcons,
        };