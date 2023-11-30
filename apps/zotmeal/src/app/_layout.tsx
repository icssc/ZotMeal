import { View } from "react-native";
import { Slot } from "expo-router";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export default function RootLayout() {
  return (
    <View className="h-full flex">
      <Header />

      <View className="flex-1">
        <Slot />
      </View>

      <Footer />
    </View>
  );
}
