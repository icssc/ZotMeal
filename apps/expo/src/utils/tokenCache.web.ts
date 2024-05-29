import type { TokenCache } from "@clerk/clerk-expo/dist/cache";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ! Not using expo-secure-store because it's not available in the web
export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return await AsyncStorage.getItem(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.error(err);
    }
  },
};
