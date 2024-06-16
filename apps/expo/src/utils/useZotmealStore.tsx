import { create } from "zustand";

import { appRouter } from "@zotmeal/api";

import { api } from "./api";

export type ZotmealData = Awaited<ReturnType<typeof appRouter.getZotmeal>>;
export type RestaurantInfo = ZotmealData[keyof ZotmealData];
export type Event = RestaurantInfo["events"][number];
export type Menu = RestaurantInfo["menus"][number];
export type Station = Menu["stations"][number];
export type Dish = Station["dishes"][number];
export type DietRestriction = Dish["dietRestriction"];
export type NutritionInfo = Dish["nutritionInfo"];

export const useZotmealQuery = (date: Date) =>
  api.getZotmeal.useQuery(
    { date },
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

interface ZotmealState {
  zotmeal: ZotmealData | null;
  setZotmeal: (zotmeal: ZotmealData) => void;
}

export const useZotmealStore = create<ZotmealState>((set) => ({
  zotmeal: null,
  setZotmeal: (zotmeal) => set({ zotmeal }),
}));
