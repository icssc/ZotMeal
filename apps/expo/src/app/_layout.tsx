import { config } from "@tamagui/config/v3";

import "@tamagui/core/reset.css";

import type { FontSource } from "expo-font";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import InterBold from "@tamagui/font-inter/otf/Inter-Bold.otf";
import Inter from "@tamagui/font-inter/otf/Inter-Medium.otf";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { createTamagui, TamaguiProvider, Theme } from "tamagui";

import HamburgerMenu from "~/components/HamburgerMenu";
import Logo from "~/components/Logo";
import { TRPCProvider } from "~/utils/api";

// Main layout of the app
// It wraps your pages with the providers they need

const tamaguiConfig = createTamagui(config);

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: Inter as FontSource,
    InterBold: InterBold as FontSource,
  });

  const colorScheme = useColorScheme();
  const { bottom, left, right } = useSafeAreaInsets();

  if (!loaded) {
    return null;
  }

  return (
    <TRPCProvider>
      <TamaguiProvider config={tamaguiConfig}>
        <ToastProvider>
          <Theme name={colorScheme}>
            <Stack
              screenOptions={{
                headerTitle: () => <Logo />,
                headerRight: () => <HamburgerMenu />,
                headerStyle: {
                  backgroundColor: "#1A1B1D",
                },
                contentStyle: {
                  backgroundColor:
                    colorScheme === "dark" ? "#1A1B1D" : "#FFFFFF",
                },
              }}
            >
              {/* <Stack.Screen
                name="events"
                options={{
                  presentation: "modal",
                }}
              /> */}
            </Stack>
            <StatusBar style="light" />
          </Theme>
          <ToastViewport
            flexDirection="column"
            bottom={bottom}
            left={left}
            right={right}
          />
        </ToastProvider>
      </TamaguiProvider>
    </TRPCProvider>
  );
}
