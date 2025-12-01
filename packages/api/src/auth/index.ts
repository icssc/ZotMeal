

import { betterAuth } from "better-auth";


export const auth = betterAuth({
  debug: true,
  // secret: process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET,
  secret: "better-auth-secret",
  baseURL: "http://localhost:8080",
  socialProviders: {
    google: {
      // clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientId: "clientID",
      clientSecret: "clientSecret",
      // clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    },
  },
});
