import { create } from "zustand";

export const TOUR_PAGES = {
  "/nutrition": "nutrition",
  "/my-foods": "my-foods",
} as const;

export type TourId = (typeof TOUR_PAGES)[keyof typeof TOUR_PAGES];

export function getTourForPath(pathname: string): TourId {
  return TOUR_PAGES[pathname as keyof typeof TOUR_PAGES] ?? null;
}

type TourState = {
  activeTour: TourId | null;
  launchId: number;
  start: (tourId: TourId) => void;
  stop: () => void;
};

export const useTourStore = create<TourState>((set) => ({
  activeTour: null,
  launchId: 0,
  start: (tourId) =>
    set((state) => ({
      activeTour: tourId,
      launchId: state.launchId + 1,
    })),
  stop: () => set({ activeTour: null }),
}));
