import { create } from "zustand";

import { Pin, Rating, UserWithRelations } from "@zotmeal/db";

interface AuthState {
  user: (UserWithRelations & { pins: Pin[]; ratings: Rating[] }) | null;
  setUser: (user: UserWithRelations) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
