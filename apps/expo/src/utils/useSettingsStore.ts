import { useColorScheme } from "react-native";
import { create } from "zustand";

interface SettingsState {
  colorSchemePreference: "light" | "dark" | "system";
  setColorSchemePreference: (
    colorScheme: SettingsState["colorSchemePreference"],
  ) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  colorSchemePreference: "system" as const,
  setColorSchemePreference: (colorSchemePreference) =>
    set({ colorSchemePreference }),
}));

export const useZotmealColorScheme = () => {
  const { colorSchemePreference } = useSettingsStore();
  const systemScheme = useColorScheme();
  return colorSchemePreference === "system"
    ? systemScheme
    : colorSchemePreference;
};
