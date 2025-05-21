import { toTitleCase } from "./funcs"; 

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
  'dog',      // meaning hot dog, trust 😵
  'shawarma'
]);

let sandwichKeywords: Set<string> = new Set<string>([
  'sandwich',
  'burger'
]);

let pizzaKeywords: Set<string> = new Set<string>([
  'pizza',
  'flatbread',
  'stromboli'
]);

let eggKeywords: Set<string> = new Set<string>([
  'egg',
  'omlette'
]);

let saladKeywords: Set<string> = new Set<string>([
  'tomato',
  'lettuce',
  'onion',
  'greens'
]);

let soupKeywords: Set<string> = new Set<string>

// NOTE: Order matters! We want to go from specific to general, so that 
// something like a "ham"burger, doesn't show up as a drumstick, when a 
// burger icon is more appropriate.
let foodIconKeywords: Set<string>[] = [
  eggKeywords,
  pizzaKeywords,
  sandwichKeywords,
  meatKeywords
]

export {StatusColors, 
        HallStatusEnum, 
        HallEnum, 
        MealTimeEnum, 
        nutrientToUnit,
        numToMonth,
        preferredCategoryOrder};