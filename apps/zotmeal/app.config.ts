import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    slug: "zotmeal",
    name: "ZotMeal",
  };
};
