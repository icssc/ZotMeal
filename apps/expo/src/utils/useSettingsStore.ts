import { useColorScheme } from "react-native";
import { create } from "zustand";

interface SettingsState {
  colorSchemePreference: "light" | "dark" | "system";
  setColorSchemePreference: (
    colorScheme: SettingsState["colorSchemePreference"],
  ) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  colorSchemePreference: "system",
  setColorSchemePreference: (colorScheme) =>
    set({ colorSchemePreference: colorScheme }),
}));

export const useZotmealColorScheme = () => {
  const { colorSchemePreference } = useSettingsStore();
  const systemScheme = useColorScheme();
  return colorSchemePreference === "system"
    ? systemScheme
    : colorSchemePreference;
};
