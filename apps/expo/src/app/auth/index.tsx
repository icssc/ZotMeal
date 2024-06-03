import * as React from "react";
import { SafeAreaView } from "react-native";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { Text } from "tamagui";

import SignInWithOAuth from "~/components/auth/SignInWithOAuth";

export default function AuthPage() {
  const { isSignedIn, isLoaded, userId } = useAuth();

  if (!isLoaded) return <Text>Loading...</Text>;

  console.log("is signed in", isSignedIn);
  return (
    <SafeAreaView>
      <SignedIn>
        <Text zIndex={10} width="100%" height="100%" backgroundColor="red">
          You are Signed in
        </Text>
      </SignedIn>
      <SignedOut>
        <SignInWithOAuth />
      </SignedOut>
    </SafeAreaView>
  );
}
