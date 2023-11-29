import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    web: {
      bundler: 'metro',
    },
    slug: "zotmeal",
    name: "ZotMeal",
  };
};
