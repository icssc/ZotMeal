import { Appearance, SafeAreaView, View } from "react-native";
import { Slot } from "expo-router";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [bg, setBg] = useState(
    Appearance.getColorScheme() === "light" ? "bg-white" : "bg-black",
  );

  useEffect(() => {
    const appearanceListener: Appearance.AppearanceListener = (preferences) => {
      setBg(preferences.colorScheme === "light" ? "bg-white" : "bg-black");
    };

    Appearance.addChangeListener(appearanceListener);
  }, []);

  return (
    <View className={`h-full flex ${bg}`}>
      <SafeAreaView className="h-full flex">
        <Header />

        <View className="flex-1">
          <Slot />
        </View>

        <Footer />
      </SafeAreaView>
    </View>
  );
}
