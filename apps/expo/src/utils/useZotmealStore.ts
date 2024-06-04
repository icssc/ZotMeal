import { create } from "zustand";

import type { Event, MenuWithRelations, Restaurant } from "@zotmeal/db";
import type { RestaurantName } from "@zotmeal/utils";

// import { anteateryData, brandywineData } from "../app/home/example_menus";

interface ZotmealState {
  selectedRestaurant: RestaurantName;
  anteateryMenu: MenuWithRelations | null;
  brandywineMenu: MenuWithRelations | null;
  anteateryEvents: Event[];
  brandywineEvents: Event[];
  setSelectedRestaurant: (restaurant: RestaurantName) => void;
  setAnteateryMenu: (anteateryMenu: MenuWithRelations | null) => void;
  setBrandywineMenu: (brandywineMenu: MenuWithRelations | null) => void;
  setAnteateryEvents: (anteateryEvents: Event[]) => void;
  setBrandywineEvents: (brandywineEvents: Event[]) => void;
}

export const useZotmealStore = create<ZotmealState>((set) => ({
  selectedRestaurant: "brandywine",
  anteateryMenu: null,
  brandywineMenu: null,
  anteateryEvents: [],
  brandywineEvents: [],
  setSelectedRestaurant: (selectedRestaurant) => set({ selectedRestaurant }),
  setAnteateryMenu: (anteateryMenu) => set({ anteateryMenu }),
  setBrandywineMenu: (brandywineMenu) => set({ brandywineMenu }),
  setAnteateryEvents: (anteateryEvents) => set({ anteateryEvents }),
  setBrandywineEvents: (brandywineEvents) => set({ brandywineEvents }),
}));
