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

const formatNutrientLabel = (nutrient: string) => {
    const label = nutrient.replace(/(Mg|G)$/, ""); // Remove units
    return label.replace(/([A-Z])/g, " $1")        // Adds a space before uppercase letters
    .replace(/^./, (char) => char.toUpperCase())   // Capitalize first letter
    .trim();
};

const formatFoodName = (name: string): string => {
  if (!name) return "";

  let formattedName = name.replace(/(®)([a-zA-Z])/g, '$1 $2');
  formattedName = toTitleCase(formattedName);
  formattedName = formattedName.replace(/-(\w)/g, (match, char) => '-' + char.toUpperCase()); // Example: Quick-Serve -> Quick-Serve
  formattedName = formattedName.replace(/'(\w)/g, (match, char) => {
    if (char.toLowerCase() === 's') return match;
    return '\'' + char.toUpperCase(); 
  });
  formattedName = formattedName.replace(/Ozw/g, 'Oz');
  formattedName = formattedName.replace(/\(\s+/g, '(');
  formattedName = formattedName.replace(/\s+\)/g, ')');

  return formattedName;
};

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

export { StatusColors, 
         HallStatusEnum, 
         HallEnum, 
         MealTimeEnum, 
         formatNutrientLabel, 
         formatFoodName,
         nutrientToUnit
};