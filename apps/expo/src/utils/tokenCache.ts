import type { TokenCache } from "@clerk/clerk-expo/dist/cache";
import * as SecureStore from "expo-secure-store";

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error(err);
    }
  },
};
