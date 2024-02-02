export interface ParsedResponse {
  restaurant: Restaurant;
  stations: Station[];
  dishes: Dish[];
}

export interface Restaurant {
  restaurant_id: string;
  restaurant_name: string;
}

export interface Station {
  station_id: string;
  restaurant_id: Restaurant['restaurant_id'];
  name: string;
}

export interface Dish {
  id: string;
  station_id: Station['station_id'];
  name: string;
  description: string;
  dietary_restriction_info: DietaryRestrictionInfo;
}

export interface DietaryRestrictionInfo {
  id: Dish['id'];
  contains_eggs: boolean;
  contains_fish: boolean;
  contains_milk: boolean;
  contains_peanuts: boolean;
  contains_shellfish: boolean;
  contains_soy: boolean;
  contains_tree_nuts: boolean;
  contains_wheat: boolean;
  contains_sesame: boolean;
  is_gluten_free: boolean;
  is_halal: boolean;
  is_kosher: boolean;
  is_locally_grown: boolean;
  is_organic: boolean;
  is_vegan: boolean;
  is_vegetarian: boolean;
}