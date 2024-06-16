import { config } from "@tamagui/config/v3";

import "@tamagui/core/reset.css";

import { useState } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Info } from "@tamagui/lucide-icons";
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import {
  Button,
  createTamagui,
  TamaguiProvider,
  Text,
  Theme,
  View,
} from "tamagui";

import { Logo } from "~/components";
import { HamburgerMenu } from "~/components/navigation/HamburgerMenu";
import { TRPCProvider, useZotmealColorScheme } from "~/utils";
import { getBaseUrl } from "~/utils/api";
import { tokenCache } from "~/utils/tokenCache";
import { env } from "../utils/env";

const tamaguiConfig = createTamagui(config);

const DevInfo = () => {
  const [open, setOpen] = useState(false);

  return (
    <View
      onPress={() => setOpen(!open)}
      zIndex={10}
      width={open ? "60%" : "10%"}
      height={open ? "25%" : "10%"}
      position="absolute"
      bottom={30}
      right={10}
    >
      {open ? (
        <Button
          unstyled
          width="100%"
          height="100%"
          backgroundColor="red"
          padding="$4"
        >
          <Text fontSize="$3" fontWeight="bold">
            Platform.OS: {Platform.OS}
            {"\n"}
            baseurl: {getBaseUrl()}
            {"\n"}
            env: {JSON.stringify(env, null, 2)}
          </Text>
        </Button>
      ) : (
        <Info size="$5" color="red" />
      )}
    </View>
  );
};

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  const colorScheme = useZotmealColorScheme();
  const { top, ...insets } = useSafeAreaInsets();

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
