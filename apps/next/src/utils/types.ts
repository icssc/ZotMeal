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

const formatNutrientLabel = (nutrient: string) => {
  return nutrient
    .replace(/([A-Z])/g, " $1") // Adds a space before uppercase letters
    .replace(/^./, (char) => char.toUpperCase())  // Capitalize first letter
    .trim();
};

const nutrientToUnit : { [nutrient: string]: string } = {
  "calories": "cal",
  "totalFat": "g",
  "transFat": "g",
  "saturatedFat": "g",
  "cholesterol": "mg",
  "sodium": "mg",
  "carbs": "g",
  "fiber": "g",
  "sugar": "g",
  "protein": "g",
  "vitaminA": "% DV",
  "vitaminC": "% DV",
  "calcium": "mg",
  "iron": "mg",
}

const mealTimeToEnum : { [mealTime: string]: MealTimeEnum } = {
  "breakfast": MealTimeEnum.BREAKFAST,
  "lunch": MealTimeEnum.LUNCH,
  "dinner": MealTimeEnum.DINNER,
  "latenight": MealTimeEnum.LATENIGHT
}

export { StatusColors, 
         HallStatusEnum, 
         HallEnum, 
         MealTimeEnum, 
         formatNutrientLabel, 
         nutrientToUnit,
         mealTimeToEnum };