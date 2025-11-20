"use client";
/*
Sign In Button
 */

import { authClient } from "@/utils/auth-client"; 
import { Button } from "../ui/shadcn/button"; 

export function GoogleSignInButton() {
  const handleSignIn = () => {
        authClient.signIn.social({
            provider: "google",
            callbackURL: '/'
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