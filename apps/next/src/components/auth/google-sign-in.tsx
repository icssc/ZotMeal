"use client";
/*
Sign In Button
 */

import { authClient } from "@/utils/auth-client"; 
import { Button } from "../ui/shadcn/button"; 

export function GoogleSignInButton() {
  const handleSignIn = () => {
        authClient.signIn.social({
            provider: "google", // starts a Google sign in flow
            callbackURL: '/' // after a successful sign-in, user is redirected to the home page
        }
    );
}

  return (
    <Button 
      onClick={handleSignIn}
      className="w-full" 
    >
      Sign In with Google
    </Button>
  );
}