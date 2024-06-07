import { create } from "zustand";

import type { Event, MenuWithRelations } from "@zotmeal/db";
import type { RestaurantName } from "@zotmeal/utils";

// import { anteateryData, brandywineData } from "../app/home/example_menus";

interface ZotmealState {
  selectedRestaurant: RestaurantName;
  anteateryMenu: MenuWithRelations | null;
  brandywineMenu: MenuWithRelations | null;
  anteateryEvents: Event[] | null;
  brandywineEvents: Event[] | null;
  setSelectedRestaurant: (restaurant: RestaurantName) => void;
  setAnteateryMenu: (anteateryMenu: MenuWithRelations | null) => void;
  setBrandywineMenu: (brandywineMenu: MenuWithRelations | null) => void;
  setAnteateryEvents: (anteateryEvents: Event[] | null) => void;
  setBrandywineEvents: (brandywineEvents: Event[] | null) => void;
}

export const useZotmealStore = create<ZotmealState>((set) => ({
  selectedRestaurant: "brandywine" as const,
  anteateryMenu: null,
  brandywineMenu: null,
  anteateryEvents: null,
  brandywineEvents: null,
  setSelectedRestaurant: (selectedRestaurant) => set({ selectedRestaurant }),
  setAnteateryMenu: (anteateryMenu) => set({ anteateryMenu }),
  setBrandywineMenu: (brandywineMenu) => set({ brandywineMenu }),
  setAnteateryEvents: (anteateryEvents) => set({ anteateryEvents }),
  setBrandywineEvents: (brandywineEvents) => set({ brandywineEvents }),
}));
