import type { ExpoConfig } from "expo/config";

const image = "./assets/zotmeal.png";
const backgroundColor = "#161B22";

const defineConfig = (): ExpoConfig => ({
  name: "expo",
  slug: "expo",
  scheme: "expo",
  version: "0.1.0",
  orientation: "portrait",
  icon: image,
  userInterfaceStyle: "automatic",
  splash: {
    image,
    resizeMode: "contain",
    backgroundColor,
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "your.bundle.identifier",
    supportsTablet: true,
  },
  android: {
    package: "your.bundle.identifier",
    adaptiveIcon: {
      foregroundImage: image,
      backgroundColor,
    },
  },
  extra: {
    eas: {
      projectId: "e5b5d2cd-098b-4fe4-85ed-ac05e395552d", // dennis' project id for now
    },
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: ["expo-router", "expo-font"],
});

export default defineConfig;
