import React, { useCallback, useEffect } from "react";
import { Button, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { SignedIn, SignedOut, useSSO } from "@clerk/clerk-expo";

import { ThemedText } from "../../components/ThemedText";

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

function AuthPage() {
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
    <View style={{
      //  flex: 1,
      //  justifyContent: "center",
      //  alignItems: "center"
       }}>
      <TouchableOpacity onPress={onPress} 
        style={styles.button}>
          <ThemedText style={styles.buttonText}>Sign In</ThemedText>
        </TouchableOpacity>
      {/* <SignedOut>
        <ThemedText>You are Signed out</ThemedText>
      </SignedOut>
      <SignedIn>
        <ThemedText>You are Signed in</ThemedText>
      </SignedIn> */}
    </View>
  );
}

export default function SignIn() {
  return (
    <>
      <AuthPage />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#309CFF",
    borderRadius: 10,
    width: 200,
    height: 60,
    justifyContent: "center",
    // shadowOpacity: .5,
    // shadowRadius: 10,
    // shadowOffset: {
    //   width: 0,
    //   height: 5
    // },
    alignSelf: 'center'
  },

  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  }, 
})