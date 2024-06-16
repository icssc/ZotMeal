import { create } from "zustand";

import { appRouter } from "@zotmeal/api";

export type User = Awaited<ReturnType<typeof appRouter.user.get>>;
export type Pin = User["pins"][number];
export type Rating = User["ratings"][number];

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
