import { config } from "@tamagui/config/v3";

import "@tamagui/core/reset.css";

import type { FontSource } from "expo-font";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/clerk-expo";
import InterBold from "@tamagui/font-inter/otf/Inter-Bold.otf";
import Inter from "@tamagui/font-inter/otf/Inter-Medium.otf";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import { createTamagui, TamaguiProvider, Theme } from "tamagui";

import { Logo } from "~/components";
import { HamburgerMenu } from "~/components/navigation/HamburgerMenu";
import { TRPCProvider, useZotmealColorScheme } from "~/utils";
import { tokenCache } from "~/utils/tokenCache";
import { env } from "../utils/env";

const tamaguiConfig = createTamagui(config);

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: Inter as FontSource,
    InterBold: InterBold as FontSource,
  });

  const colorScheme = useZotmealColorScheme();

  const { bottom, left, right } = useSafeAreaInsets();

  if (!loaded) return null;

  return (
    <TRPCProvider>
      <TamaguiProvider config={tamaguiConfig}>
        <ClerkProvider
          publishableKey={env.CLERK_PUBLISHABLE_KEY}
          tokenCache={tokenCache}
        >
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
                <Stack.Screen name="(tabs)" />
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
        </ClerkProvider>
      </TamaguiProvider>
    </TRPCProvider>
  );
}
