import type { DishWithRelations } from "@zotmeal/db";

const dishId = "dish123";
const menuId = "menu123";
const stationId = "station123";

export const testData = {
  id: dishId,
  name: "Grilled Salmon with Quinoa",
  description:
    "A heart-healthy dish featuring omega-3 rich salmon, served over a bed of fluffy quinoa with a side of steamed asparagus.",
  category: "Main Course",
  menuId,
  stationId,
  dietRestriction: {
    dishId,
    containsEggs: false,
    containsFish: true,
    containsMilk: false,
    containsPeanuts: false,
    containsSesame: false,
    containsShellfish: false,
    containsSoy: false,
    containsTreeNuts: false,
    containsWheat: false,
    isGlutenFree: true,
    isHalal: true,
    isKosher: false,
    isLocallyGrown: true,
    isOrganic: true,
    isVegan: false,
    isVegetarian: false,
  },
  nutritionInfo: {
    dishId,
    servingSize: "350",
    servingUnit: "grams",
    calories: "560",
    caloriesFromFat: "190",
    totalFatG: "21g",
    transFatG: "0g",
    saturatedFatG: "4g",
    cholesterolMg: "125mg",
    sodiumMg: "650mg",
    totalCarbsG: "45g",
    dietaryFiberG: "6g",
    sugarsMg: "5g",
    proteinG: "45g",
    vitaminAIU: "25%",
    vitaminCIU: "30%",
    calciumMg: "4%",
    ironMg: "15%",
  },
} satisfies DishWithRelations;

export const updateData = {
  ...testData,
  name: "<Updated> Grilled Salmon with Quinoa",
} satisfies DishWithRelations;
