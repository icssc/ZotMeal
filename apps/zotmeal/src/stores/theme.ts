import { Appearance, Dimensions, type ColorSchemeName } from "react-native";
import { create } from "zustand";

/**
 * The color store keeps track of theme variables.
 */
export interface ThemeStore {
  colorScheme: ColorSchemeName;
  width: number;
  setColorScheme: typeof Appearance.setColorScheme
}

export const useThemeStore = create<ThemeStore>((set) => {
  Appearance.addChangeListener((preferences) => {
    set({ colorScheme: preferences.colorScheme });
  });

  Dimensions.addEventListener("change", ({ window }) => {
    set({ width: window.width });
  })

  return {
    colorScheme: Appearance.getColorScheme(),
    setColorScheme: Appearance.setColorScheme,
    width: Dimensions.get("window").width,
  };
});
