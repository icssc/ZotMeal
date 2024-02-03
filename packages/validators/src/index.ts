import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export const GetMenuSchema = z.object({});

const MenuStationSchema = z.object({
  StationId: z.string().min(1),
  Name: z.string().min(1),
});

const MenuProductSchema = z.object({
  StationId: z.string().min(1),
  Product: z.object({
    ProductId: z.string().min(1),
    MarketingName: z.string().min(1),
    ShortDescription: z.string(),
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
  }),
});

export const CampusDishResponseSchema = z.object({
  LocationId: z.string(),
  Menu: z.object({
    MenuStations: z.array(MenuStationSchema),
    MenuProducts: z.array(MenuProductSchema),
  }),
});

export type CampusDishResponse = z.infer<typeof CampusDishResponseSchema>;

export const DietaryRestrictionInfoSchema = z.object({
  id: z.string(),
  contains_eggs: z.boolean().nullable(),
  contains_fish: z.boolean().nullable(),
  contains_milk: z.boolean().nullable(),
  contains_peanuts: z.boolean().nullable(),
  contains_shellfish: z.boolean().nullable(),
  contains_soy: z.boolean().nullable(),
  contains_tree_nuts: z.boolean().nullable(),
  contains_wheat: z.boolean().nullable(),
  contains_sesame: z.boolean().nullable(),
  is_gluten_free: z.boolean().nullable(),
  is_halal: z.boolean().nullable(),
  is_kosher: z.boolean().nullable(),
  is_locally_grown: z.boolean().nullable(),
  is_organic: z.boolean().nullable(),
  is_vegan: z.boolean().nullable(),
  is_vegetarian: z.boolean().nullable(),
});

export const DishSchema = z.object({
  id: z.string(),
  station_id: z.string(),
  name: z.string(),
  description: z.string(),
  dietary_restriction_info: DietaryRestrictionInfoSchema,
});

export const RestaurantSchema = z.object({
  restaurant_id: z.string(),
  restaurant_name: z.string(),
});

export const StationSchema = z.object({
  station_id: z.string(),
  restaurant_id: z.string(),
  name: z.string(),
});

export const ParsedResponseSchema = z.object({
  restaurant: RestaurantSchema,
  stations: z.array(StationSchema),
  dishes: z.array(DishSchema),
});
