import { Appearance, Dimensions, type ColorSchemeName } from "react-native";
import { create } from "zustand";

/**
 * The color store keeps track of theme variables.
 */
export interface ThemeStore {
  colorScheme: ColorSchemeName;
  width: number;
  setColorScheme: typeof Appearance.setColorScheme
  bgColor: string;
  textColor: string;
}

export const useThemeStore = create<ThemeStore>((set) => {
  Appearance.addChangeListener((preferences) => {
    set({ colorScheme: preferences.colorScheme });
    set({ bgColor: preferences.colorScheme === "dark" ? 'bg-black' : 'bg-white' });
    set({ textColor: preferences.colorScheme === "dark" ? 'text-white' : 'text-black' });
  });

  Dimensions.addEventListener("change", ({ window }) => {
    set({ width: window.width });
  })

  const colorScheme = Appearance.getColorScheme();

  const bgColor = colorScheme === 'dark' ? 'bg-black' : 'bg-white';
  const textColor = colorScheme === 'dark' ? 'text-white' : 'text-black';

  return {
    colorScheme,
    setColorScheme: Appearance.setColorScheme,
    width: Dimensions.get("window").width,
    bgColor,
    textColor,
  };
});
