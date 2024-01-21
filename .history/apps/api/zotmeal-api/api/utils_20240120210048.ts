//Relevant Nutrition Properties
export const NUTRITION_PROPERTIES = [
  'IsVegan',
  'IsVegetarian',
  'ServingSize',
  'ServingUnit',
  'Calories',
  'CaloriesFromFat',
  'TotalFat',
  'TransFat',
  'Cholesterol',
  'Sodium',
  'TotalCarbohydrates',
  'DietaryFiber',
  'Sugars',
  'Protein',
  'VitaminA',
  'VitaminC',
  'Calcium',
  'Iron',
  'SaturatedFat',
] as const;





export const DEFAULT_PRICES = {
  breakfast: 9.75,
  lunch: 13.75,
  brunch: 13.75,
  dinner: 14.95,
} as const;


export type MEAL_PERIOD_TO_ID = {
  breakfast: 49,
  lunch: 106,
  dinner: 107,
  brunch: 2651,
  readonly [key: string]: string; // Allow any string as a property name

} as const;

export const LOCATION_ID = {
  brandywine: '3314',
  anteatery: '3056',
} as const;

export function getMealPeriods(time: string) {
  return new Date(time).toLocaleTimeString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: '2-digit',
    minute: '2-digit',
  });
}
