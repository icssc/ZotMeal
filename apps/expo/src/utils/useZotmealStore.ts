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

export default create<ZotmealState>((set) => ({
  selectedRestaurant: "brandywine",
  anteateryMenu: null,
  brandywineMenu: null,
  anteateryEvents: [],
  brandywineEvents: [],
  setSelectedRestaurant: (selectedRestaurant: Restaurant["name"]) =>
    set({ selectedRestaurant }),
  setAnteateryMenu: (anteateryMenu: MenuWithRelations | null) =>
    set({ anteateryMenu }),
  setBrandywineMenu: (brandywineMenu: MenuWithRelations | null) =>
    set({ brandywineMenu }),
  setAnteateryEvents: (anteateryEvents: Event[]) => set({ anteateryEvents }),
  setBrandywineEvents: (brandywineEvents: Event[]) => set({ brandywineEvents }),
}));
