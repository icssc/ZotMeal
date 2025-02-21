import { create } from "zustand";

import { appRouter } from "@zotmeal/api";

import { api } from "../utils/api";

export type ZotmealData = Awaited<ReturnType<typeof appRouter.zotmeal>>;
export type RestaurantName = keyof ZotmealData;
export type RestaurantInfo = ZotmealData[RestaurantName];
export type Event = RestaurantInfo["events"][number];
export type Menu = RestaurantInfo["menus"][number];
export type Station = Menu["stations"][number];
export type Dish = Station["dishes"][number];
export type DietRestriction = Dish["dietRestriction"];
export type NutritionInfo = Dish["nutritionInfo"];

export const useZotmealQuery = (date: Date) =>
  api.zotmeal.useQuery(
    { date },
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

interface ZotmealState {
  zotmeal: ZotmealData | null;
  setZotmeal: (zotmeal: ZotmealData) => void;
  selectedItem: Dish | Event | null;
  setSelectedItem: (item: Dish | Event) => void;
}

export const useZotmealStore = create<ZotmealState>((set) => ({
  zotmeal: null,
  setZotmeal: (zotmeal) => set({ zotmeal }),
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
}));
