import { create } from "zustand";

import type { MenuWithRelations, Restaurant } from "@zotmeal/db";
import type { RestaurantName } from "@zotmeal/utils";

// import { anteateryData, brandywineData } from "../app/home/example_menus";

interface MenuState {
  selectedRestaurant: RestaurantName;
  anteateryMenu: MenuWithRelations | null;
  brandywineMenu: MenuWithRelations | null;
  setSelectedRestaurant: (restaurant: RestaurantName) => void;
  setAnteateryMenu: (anteateryMenu: MenuWithRelations) => void;
  setBrandywineMenu: (brandywineMenu: MenuWithRelations) => void;
}

export default create<MenuState>((set) => ({
  selectedRestaurant: "brandywine",
  anteateryMenu: null,
  brandywineMenu: null,
  setSelectedRestaurant: (selectedRestaurant: Restaurant["name"]) =>
    set({ selectedRestaurant }),
  setAnteateryMenu: (anteateryMenu: MenuWithRelations) =>
    set({ anteateryMenu }),
  setBrandywineMenu: (brandywineMenu: MenuWithRelations) =>
    set({ brandywineMenu }),
}));
