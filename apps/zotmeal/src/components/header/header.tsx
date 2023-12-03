import { Text, View } from "react-native";
import { Banner } from "./banner";
import { useThemeStore } from "../../stores/theme";
import { useMemo } from "react";

export function Header() {
  const colorScheme = useThemeStore((store) => store.colorScheme);

  const bg = useMemo(() => {
    switch (colorScheme) {
      case "dark":
        return "bg-black";
      case "light":
        return "bg-white";
      default:
        return "bg-black";
    }
  }, [colorScheme]);

  const textColor = useMemo(() => {
    switch (colorScheme) {
      case "dark":
        return "text-white";
      case "light":
        return "text-black";
      default:
        return "text-white";
    }
  }, [colorScheme]);

  return (
    <View>
      <View className={`${bg} h-12 justify-center`}>
        <Text className={`${textColor} text-2xl text-center font-extrabold`}>ZotMeal</Text>
      </View>
      <Banner />
    </View>
  );
}
