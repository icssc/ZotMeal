import React from "react";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";

export const useWarmUpBrowser =
  Platform.OS === "web"
    ? () => {}
    : () => {
        React.useEffect(() => {
          void WebBrowser.warmUpAsync();
          return () => void WebBrowser.coolDownAsync();
        }, []);
      };
