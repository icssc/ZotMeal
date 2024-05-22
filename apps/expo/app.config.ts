import type { ExpoConfig } from "expo/config";

const defineConfig = (): ExpoConfig => ({
  name: "expo",
  slug: "expo",
  scheme: "expo",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#1F104A",
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
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
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
  plugins: ["expo-router"],
});

export default defineConfig;
