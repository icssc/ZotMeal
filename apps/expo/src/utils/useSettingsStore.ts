import { useColorScheme } from "react-native";
import { create } from "zustand";

interface SettingsState {
  colorSchemePreference: "light" | "dark" | "system";
  setColorSchemePreference: (
    colorScheme: SettingsState["colorSchemePreference"],
  ) => void;
}

/** Store for global settings. */
export const useSettingsStore = create<SettingsState>((set) => ({
  colorSchemePreference: "system" as const,
  setColorSchemePreference: (colorSchemePreference) =>
    set({ colorSchemePreference }),
}));

/** Hook for accessing global {@link colorSchemePreference}. */
export const useZotmealColorScheme = () => {
  const { colorSchemePreference } = useSettingsStore();
  const systemScheme = useColorScheme();

  return colorSchemePreference === "system"
    ? systemScheme
    : colorSchemePreference;
};
