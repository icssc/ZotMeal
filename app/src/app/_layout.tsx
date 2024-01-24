import { SafeAreaView, View } from "react-native";
import { Slot } from "expo-router";
import { Header } from "../components/header";
import { useThemeStore } from "../stores/theme";

export default function RootLayout() {
  const bgColor = useThemeStore(store => store.bgColor)

  return (
    <View className={`h-full flex ${bgColor}`}>
      <SafeAreaView className="h-full flex">
        <Header />
        <View className="flex-1">
          <Slot />
        </View>
      </SafeAreaView>
    </View>
  );
}
