import { config } from '@tamagui/config/v3';
import '@tamagui/core/reset.css';
import InterBold from "@tamagui/font-inter/otf/Inter-Bold.otf";
import Inter from "@tamagui/font-inter/otf/Inter-Medium.otf";
import { Menu } from '@tamagui/lucide-icons';
import type { FontSource } from "expo-font";
import { useFonts } from "expo-font";
import { Link, Stack, useSegments } from "expo-router";
import type { Href } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { Adapt, Button, H3, Image, Popover, Separator, TamaguiProvider, Theme, View, YGroup, createTamagui } from "tamagui";
import { TRPCProvider } from "~/utils/api";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Drawer } from "expo-router/drawer";

// Main layout of the app
// It wraps your pages with the providers they need

const tamaguiConfig = createTamagui(config);

// TODO: linking should only push to stack when the screen isn't home
export function HamburgerMenu() {
  const currentSegment = useSegments()[0] ?? "";
  const screens: Record<string, Href<"pathname">> = {
    "Home": "/",
    "Events": "/events/",
    "Settings": "/settings/",
    "About": "/about/",
    "Privacy Policy": "/privacy-policy/",
  };

  return (
    <Popover placement="top">
      <Popover.Trigger asChild>
        <Button backgroundColor={0} padding={0}>
          <Menu color="white" size="$2" />
        </Button>
      </Popover.Trigger>
      <Adapt when={"sm" as unknown as undefined} platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom snapPoints={[50]}>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay
            animation="quickest"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }} />
        </Popover.Sheet>
      </Adapt>
      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quickest',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <YGroup separator={<Separator />}>
          {Object
            .entries(screens)
            .map(([name, path]) => (
              <YGroup.Item key={name}>
                <Popover.Close asChild disabled={path.replaceAll("/", "") === currentSegment}>
                  <Link
                    replace
                    href={path}
                    asChild
                    disabled={path.replaceAll("/", "") === currentSegment}
                  >
                    <Button
                      size="$5"
                      fontWeight={"800"}
                      paddingHorizontal="$5"
                      borderRadius="$10"
                      disabled={path.replaceAll("/", "") === currentSegment}
                      disabledStyle={{
                        opacity: 0.3,
                      }}
                    >
                      {name}
                    </Button>
                  </Link>
                </Popover.Close>
              </YGroup.Item>
            ))}
          <YGroup.Item>
            <Popover.Close asChild>
              <Button
                size="$5"
                fontWeight={"800"}
                paddingHorizontal="$5"
                borderRadius="$10"
              >
                Close
              </Button>
            </Popover.Close>
          </YGroup.Item>
        </YGroup>
      </Popover.Content>
    </Popover>
  );
}

export const Logo = () => (
  <View flexDirection="row">
    <Image
      resizeMode="contain"
      alignSelf="center"
      source={
        {
          width: 43,
          height: 43,
          // uri: "https://www.clipartmax.com/png/middle/432-4326703_uci-peter-the-anteater-sticker.png"
          uri: "https://c.tenor.com/MBn4pz0PYgMAAAAd/tenor.gif"
        }
      }
    />
    <H3
      color="white"
      fontWeight={"800"}
    >
      ZotMeal
    </H3>
  </View>
)

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: Inter as FontSource,
    InterBold: InterBold as FontSource,
  });

  const colorScheme = useColorScheme();

  if (!loaded) {
    return null;
  }

  return (
    <TRPCProvider>
      <TamaguiProvider config={tamaguiConfig}>
        <Theme name={colorScheme}>

          {/* <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer>
            <Drawer.Screen
            name="index"
            options={{
              drawerLabel: 'Home',
              title: 'overview',
            }}
            />
            <Drawer.Screen
            name="settings"
            options={{
              drawerLabel: 'Settings',
              title: 'Settings',
            }}
            />
            <Drawer.Screen
            name="about"
            options={{
              drawerLabel: 'About',
              title: 'About',
            }}
            />
            <Drawer.Screen
            name="privacy-policy"
            options={{
              drawerLabel: 'Privacy Policy',
              title: 'Privacy Policy',
            }}
            />
            </Drawer>
          </GestureHandlerRootView> */}
          <Stack
            screenOptions={{
              headerTitle: () => <Logo />,
              headerRight: () => <HamburgerMenu />,
              headerStyle: {
                backgroundColor: "#1A1B1D",
              },
              contentStyle: {
                backgroundColor: colorScheme === "dark" ? "#1A1B1D" : "#FFFFFF",
              },
            }}
          />
          <StatusBar />
        </Theme>
      </TamaguiProvider>
    </TRPCProvider>
  )
}
