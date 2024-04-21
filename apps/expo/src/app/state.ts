import { create } from "zustand";

import type { MenuWithRelations, Restaurant } from "@zotmeal/db";

import { anteateryData, brandywineData } from "./home/example_data";

interface MenuState {
  selectedRestaurant: Restaurant["name"];
  anteateryMenu: MenuWithRelations | null;
  brandywineMenu: MenuWithRelations | null;
  setSelectedRestaurant: (restaurant: Restaurant["name"]) => void;
  setAnteateryMenu: (anteateryMenu: MenuWithRelations) => void;
  setBrandywineMenu: (brandywineMenu: MenuWithRelations) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  selectedRestaurant: "brandywine",
  anteateryMenu: anteateryData,
  brandywineMenu: brandywineData,
  // anteateryMenu: null,
  // brandywineMenu: null,
  setSelectedRestaurant: (selectedRestaurant: Restaurant["name"]) =>
    set({ selectedRestaurant }),
  setAnteateryMenu: (anteateryMenu: MenuWithRelations) =>
    set({ anteateryMenu }),
  setBrandywineMenu: (brandywineMenu: MenuWithRelations) =>
    set({ brandywineMenu }),
}));
