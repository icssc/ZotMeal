import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ColorSchemePreference = "light" | "dark" | "system";

/** User settings persisted in AsyncStorage. */
interface SettingsState {
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  colorSchemePreference: ColorSchemePreference;
  setColorSchemePreference: (
    colorSchemePreference: ColorSchemePreference,
  ) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      toggleNotifications: () =>
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      colorSchemePreference: "system",
      setColorSchemePreference: (colorSchemePreference) =>
        set(() => ({ colorSchemePreference })),
    }),
    {
      name: "settings",
      storage:
        Platform.OS === "web"
          ? undefined
          : createJSONStorage(() => AsyncStorage),
    },
  ),
);
