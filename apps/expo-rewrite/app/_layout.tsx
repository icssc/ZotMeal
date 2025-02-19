import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import "react-native-reanimated";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SheetProvider } from "react-native-sheet-transitions";

import { useColorScheme } from "../hooks/useColorScheme";
import { TRPCProvider } from "../utils/api";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Default: require("../assets/fonts/Nohemi-Regular.ttf"),
    DefaultSemiBold: require("../assets/fonts/Nohemi-Medium.ttf"),
    DefaultBold: require("../assets/fonts/Nohemi-Bold.ttf"),
    DefaultBlack: require("../assets/fonts/Nohemi-Black.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TRPCProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView>
          <SheetProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </SheetProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </TRPCProvider>
  );
}
