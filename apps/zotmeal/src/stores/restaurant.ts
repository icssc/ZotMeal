import { create } from "zustand";
import type { Restaurant } from "../lib/constants";

/**
 * The restaurant store keeps track of the current dining hall being viewed.
 */
export interface RestaurantStore {
  restaurant: Restaurant;

  setRestaurant(restaurant: Restaurant): void;
}

export const useRestaurantStore = create<RestaurantStore>((set) => {
  return {
    restaurant: 'Anteatery',
    setRestaurant: (restaurant) => set({ restaurant }),
  };
});
