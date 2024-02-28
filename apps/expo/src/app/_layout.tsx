import { config } from '@tamagui/config/v3';
import '@tamagui/core/reset.css';
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { H3, Image, TamaguiProvider, Theme, View, createTamagui } from "tamagui";
import { TRPCProvider } from "~/utils/api";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Drawer } from "expo-router/drawer";

// Main layout of the app
// It wraps your pages with the providers they need

const tamaguiConfig = createTamagui(config);

const Logo = () => (
  <View flexDirection="row">
    <Image
      resizeMode="contain"
      alignSelf="center"
      source={
        {
          width: 50,
          height: 50,
          uri: "https://www.clipartmax.com/png/middle/432-4326703_uci-peter-the-anteater-sticker.png"
        }
      }
    />
    <H3
      color="#FFFFFF"
      fontWeight={"bold"}
    >
      ZotMeal
    </H3>
  </View>
)

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
