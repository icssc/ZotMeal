import { z } from "zod";

export const MenuStationSchema = z.object({
  StationId: z.string().min(1),
  Name: z.string().min(1),
});

export const MenuProductSchema = z.object({
  ProductId: z.string().min(1),
  StationId: z.string().min(1),
  Product: z.object({
    MarketingName: z.string().min(1),
    Categories: z.array(z.object({ DisplayName: z.string().min(1) })).min(1),
    ShortDescription: z.string(),
    // Diet Restrictions
    ContainsEggs: z.boolean().nullable(),
    ContainsFish: z.boolean().nullable(),
    ContainsMilk: z.boolean().nullable(),
    ContainsPeanuts: z.boolean().nullable(),
    ContainsShellfish: z.boolean().nullable(),
    ContainsSoy: z.boolean().nullable(),
    ContainsTreeNuts: z.boolean().nullable(),
    ContainsWheat: z.boolean().nullable(),
    ContainsSesame: z.boolean().nullable(),
    IsGlutenFree: z.boolean().nullable(),
    IsHalal: z.boolean().nullable(),
    IsKosher: z.boolean().nullable(),
    IsLocallyGrown: z.boolean().nullable(),
    IsOrganic: z.boolean().nullable(),
    IsVegan: z.boolean().nullable(),
    IsVegetarian: z.boolean().nullable(),
    // Nutrition Info
    ServingSize: z.string().nullable(),
    ServingUnit: z.string().nullable(),
    Calories: z.string().nullable(),
    TotalFat: z.string().nullable(),
    TransFat: z.string().nullable(),
    Cholesterol: z.string().nullable(),
    Sodium: z.string().nullable(),
    TotalCarbohydrates: z.string().nullable(),
    DietaryFiber: z.string().nullable(),
    Sugars: z.string().nullable(),
    Protein: z.string().nullable(),
    VitaminA: z.string().nullable(),
    VitaminC: z.string().nullable(),
    Calcium: z.string().nullable(),
    Iron: z.string().nullable(),
    SaturatedFat: z.string().nullable(),
  }),
});

export type CampusDishMenuProduct = z.infer<typeof MenuProductSchema>;
