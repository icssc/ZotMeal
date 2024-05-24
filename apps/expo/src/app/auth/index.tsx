import * as React from "react";
import { SafeAreaView } from "react-native";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { Text } from "tamagui";

import SignInWithOAuth from "~/components/auth/SignInWithOAuth";

export default function AuthPage() {
  const auth = useAuth();
  console.log("is signed in", auth.isSignedIn);
  return (
    <SafeAreaView>
      <SignedIn>
        <Text>You are Signed in</Text>
      </SignedIn>
      <SignedOut>
        <SignInWithOAuth />
      </SignedOut>
    </SafeAreaView>
  );
}
