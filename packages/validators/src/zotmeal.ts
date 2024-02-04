import { z } from "zod";

export const DietRestrictionSchema = z.object({
  id: z.string(),
  containsEggs: z.boolean().nullable(),
  containsFish: z.boolean().nullable(),
  containsMilk: z.boolean().nullable(),
  containsPeanuts: z.boolean().nullable(),
  containsShellfish: z.boolean().nullable(),
  containsSoy: z.boolean().nullable(),
  containsTreeNuts: z.boolean().nullable(),
  containsWheat: z.boolean().nullable(),
  containsSesame: z.boolean().nullable(),
  isGlutenFree: z.boolean().nullable(),
  isHalal: z.boolean().nullable(),
  isKosher: z.boolean().nullable(),
  isLocallyGrown: z.boolean().nullable(),
  isOrganic: z.boolean().nullable(),
  isVegan: z.boolean().nullable(),
  isVegetarian: z.boolean().nullable(),
});

export const NutritionInfoSchema = z.object({
  id: z.string(),
  servingSize: z.string().nullable(),
  servingUnit: z.string().nullable(),
  calories: z.string().nullable(),
  caloriesFromFat: z.string().nullable(),
  totalFat: z.string().nullable(),
  transFat: z.string().nullable(),
  cholesterol: z.string().nullable(),
  sodium: z.string().nullable(),
  totalCarbohydrates: z.string().nullable(),
  dietaryFiber: z.string().nullable(),
  sugars: z.string().nullable(),
  protein: z.string().nullable(),
  vitaminA: z.string().nullable(),
  vitaminC: z.string().nullable(),
  calcium: z.string().nullable(),
  iron: z.string().nullable(),
  saturatedFat: z.string().nullable(),
});

export const DishSchema = z.object({
  id: z.string(),
  stationId: z.string(),
  name: z.string(),
  description: z.string(),
  dietRestriction: DietRestrictionSchema,
  nutritionInfo: NutritionInfoSchema,
});

export const RestaurantSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const StationSchema = z.object({
  id: z.string(),
  restaurantId: z.string(),
  name: z.string(),
});


export const MenuPeriodSchema = z.object({
  id: z.string(),
  name: z.string(),
  start: z.string(),
  end: z.string(),
});

export const ParsedResponseSchema = z.object({
  id: z.string(),
  restaurant: RestaurantSchema,
  stations: z.array(StationSchema),
  dishes: z.array(DishSchema),
  menuPeriods: z.array(MenuPeriodSchema),
});

export type ParsedResponse = z.infer<typeof ParsedResponseSchema>;
