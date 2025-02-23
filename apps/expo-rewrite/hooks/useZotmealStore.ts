import { create } from "zustand";

import { Dish, Event, ZotmealData } from "../utils/api";

type SelectedItem = (Dish & { type: "Dish" }) | (Event & { type: "Event" });

/** Core state for the app. */
interface ZotmealState {
  zotmeal: ZotmealData | null;
  setZotmeal: (zotmeal: ZotmealData) => void;
  selectedItem: SelectedItem | null;
  setSelectedItem: (item: SelectedItem) => void;
}

export const useZotmealStore = create<ZotmealState>((set) => ({
  zotmeal: null,
  setZotmeal: (zotmeal) => set({ zotmeal }),
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),
}));
