import { useColorScheme as useRNColorScheme } from "react-native";

import { useSettingsStore } from "./useSettingsStore";

export function useZotmealColorScheme() {
  const { colorSchemePreference } = useSettingsStore();
  const systemColorScheme = useRNColorScheme();

  if (colorSchemePreference === "system") {
    return systemColorScheme ?? "light";
  }

  return colorSchemePreference;
}
