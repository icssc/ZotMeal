import React, { useCallback, useEffect } from "react";
import { Modal, View } from "react-native";
import { Switch, TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { SignedIn, SignedOut, useSSO } from "@clerk/clerk-expo";

import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { IconSymbol } from "../../components/ui/IconSymbol";
import { useSettingsStore } from "../../hooks/useSettingsStore";
import { useThemeColor } from "../../hooks/useThemeColor";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

function AuthButton() {
  const secondaryBackgroundColor = useThemeColor({}, "secondaryBackground");
  useWarmUpBrowser();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // Defaults to current path
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        console.log("createdSessionId", createdSessionId);
        setActive!({ session: createdSessionId });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 10,
        marginTop: 10,
      }}
    >
      <SignedOut>
        <ThemedView style={{ width: "50%" }}>
          <ThemedText>You are signed out.</ThemedText>
        </ThemedView>
        <ThemedView
          style={{
            width: "50%",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={onPress}
            style={{
              backgroundColor: secondaryBackgroundColor,
              padding: 5,
              paddingHorizontal: 12,
              borderRadius: 18,
            }}
          >
            <ThemedText>Login</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SignedOut>
      <SignedIn>
        <ThemedText style={{ width: "50%" }}>You are signed in.</ThemedText>
        <TouchableOpacity
          // TODO: implement sign out
          // onPress={}
          style={{
            backgroundColor: secondaryBackgroundColor,
            padding: 5,
            paddingHorizontal: 12,
            borderRadius: 18,
          }}
        >
          <ThemedText>Sign out</ThemedText>
        </TouchableOpacity>
      </SignedIn>
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [uri, setUri] = React.useState("");
  const {
    notificationsEnabled,
    toggleNotifications,
    colorSchemePreference,
    setColorSchemePreference,
  } = useSettingsStore();
  const textColor = useThemeColor({}, "text");
  const secondaryBackgroundColor = useThemeColor({}, "secondaryBackground");

  return (
    <>
      <Modal
        animationType="slide"
        visible={!!uri}
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setUri("");
        }}
      >
        <WebView source={{ uri }} />
      </Modal>
      <ThemedView
        style={{ flex: 1, paddingTop: insets.top + 50, paddingHorizontal: 10 }}
      >
        <ThemedView style={{ marginBottom: 40 }}>
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: 20,
              marginLeft: 10,
              marginTop: 0,
            }}
          >
            Account
          </ThemedText>
          <AuthButton />
        </ThemedView>
        <ThemedView style={{ marginBottom: 40 }}>
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: 20,
              marginLeft: 10,
              marginTop: 0,
            }}
          >
            Settings
          </ThemedText>
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 10,
              marginLeft: 10,
            }}
          >
            <ThemedText
              type="default"
              style={{
                width: "50%",
              }}
            >
              Notifications
            </ThemedText>
            <ThemedView
              style={{
                width: "50%",
                alignItems: "center",
              }}
            >
              <Switch
                trackColor={{ false: undefined, true: "#007AFF" }}
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
              />
            </ThemedView>
          </ThemedView>
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
              marginLeft: 10,
            }}
          >
            <ThemedText
              type="default"
              style={{
                width: "50%",
              }}
            >
              Color Scheme
            </ThemedText>
            <ThemedView
              style={{
                width: "50%",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => setColorSchemePreference("light")}
              >
                <ThemedView
                  style={{
                    paddingHorizontal: 8,
                    height: 30,
                    backgroundColor:
                      colorSchemePreference === "light"
                        ? secondaryBackgroundColor
                        : undefined,
                    borderWidth: 1.5,
                    borderRadius: 15,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderColor: secondaryBackgroundColor,
                    justifyContent: "center",
                    padding: 3,
                  }}
                >
                  <IconSymbol
                    name="sun.max"
                    color={textColor}
                    size={20}
                    style={{ margin: "auto" }}
                  />
                </ThemedView>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setColorSchemePreference("dark")}
              >
                <ThemedView
                  style={{
                    paddingHorizontal: 8,
                    height: 30,
                    backgroundColor:
                      colorSchemePreference === "dark"
                        ? secondaryBackgroundColor
                        : undefined,
                    borderWidth: 1.5,
                    borderLeftWidth: 0,
                    borderColor: secondaryBackgroundColor,
                    justifyContent: "center",
                    padding: 3,
                  }}
                >
                  <IconSymbol
                    name="moon"
                    color={textColor}
                    size={20}
                    style={{ margin: "auto" }}
                  />
                </ThemedView>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setColorSchemePreference("system")}
              >
                <ThemedView
                  style={{
                    paddingHorizontal: 8,
                    height: 30,
                    backgroundColor:
                      colorSchemePreference === "system"
                        ? secondaryBackgroundColor
                        : undefined,
                    borderWidth: 1.5,
                    borderLeftWidth: 0,
                    borderRadius: 15,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    padding: 6,
                    borderColor: secondaryBackgroundColor,
                  }}
                >
                  <ThemedText
                    type="default"
                    style={{
                      fontSize: 13,
                      marginTop: 2,
                    }}
                  >
                    Auto
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        <ThemedView style={{ marginBottom: 40 }}>
          <ThemedText
            type="defaultSemiBold"
            style={{
              fontSize: 20,
              marginLeft: 10,
              marginTop: 0,
            }}
          >
            App Info
          </ThemedText>
          <ThemedView
            style={{
              alignItems: "center",
              marginTop: 10,
              marginHorizontal: 10,
              gap: 5,
            }}
          >
            <ThemedView style={{ width: "100%" }}>
              <TouchableOpacity
                onPress={() => {
                  setUri("https://www.google.com/search?q=about+zotmeal");
                }}
                style={{
                  backgroundColor: secondaryBackgroundColor,
                  justifyContent: "center",
                  height: 40,
                  padding: 5,
                  paddingHorizontal: 12,
                  borderRadius: 5,
                }}
              >
                <ThemedText type="default">About ZotMeal</ThemedText>
              </TouchableOpacity>
            </ThemedView>
            <ThemedView style={{ width: "100%" }}>
              <TouchableOpacity
                onPress={() => {
                  setUri("https://www.google.com/search?q=privacy+policy");
                }}
                style={{
                  backgroundColor: secondaryBackgroundColor,
                  justifyContent: "center",
                  height: 40,
                  padding: 5,
                  paddingHorizontal: 12,
                  borderRadius: 5,
                }}
              >
                <ThemedText type="default">Privacy Policy</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </>
  );
}
