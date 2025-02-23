import { create } from "zustand";

import { User } from "../utils/api";

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
}

// TODO: persist user in AsyncStorage
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
