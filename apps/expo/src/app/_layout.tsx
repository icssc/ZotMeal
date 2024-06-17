import { config } from "@tamagui/config/v3";

import "@tamagui/core/reset.css";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/clerk-expo";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { createTamagui, TamaguiProvider, Theme } from "tamagui";

import { DevInfo, Logo } from "~/components";
import { HamburgerMenu } from "~/components/navigation/HamburgerMenu";
import { TRPCProvider, useZotmealColorScheme } from "~/utils";
import { tokenCache } from "~/utils/tokenCache";
import { env } from "../utils/env";

const tamaguiConfig = createTamagui(config);

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  const colorScheme = useZotmealColorScheme();
  const insets = useSafeAreaInsets();

  if (!loaded) return null;

  return (
    <ClerkProvider
      publishableKey={env.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
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
                {/* <Stack.Screen name="(tabs)" /> */}
                {/* <Stack.Screen
                name="events"
                options={{
                  presentation: "modal",
                  }}
                  /> */}
              </Stack>
              <StatusBar style="light" />
            </Theme>
            <ToastViewport flexDirection="column" {...insets} />
            <DevInfo />
          </ToastProvider>
        </TamaguiProvider>
      </TRPCProvider>
    </ClerkProvider>
  );
}
