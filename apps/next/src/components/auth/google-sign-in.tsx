"use client";
/*
Sign In Button
 */

import { authClient } from "@/utils/auth-client"; 
import { Button } from "../ui/shadcn/button"; 

export function GoogleSignInButton() {
  const handleSignIn = async () => {
        try {
    // console.log("Starting sign in...");
    // console.log("Base URL:", process.env.NEXT_PUBLIC_BASE_URL);
    const result = await authClient.signIn.social({
      provider: "google",
    });
    
    console.log("Sign in result:", result);
  } catch (error) {
    console.error("Sign in error:", error);
    if (error instanceof Response) {
      const text = await error.text();
      console.error("Error response body:", text);
    }
  }
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
