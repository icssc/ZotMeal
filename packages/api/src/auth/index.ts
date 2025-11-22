/* 
FOR GOOGLE AUTH -> SETS UP GOOGLE AUTH PROVIDER FROM BETTERAUTH
*/
// import { betterAuth } from "better-auth";


// export const auth = betterAuth({
//   secret: process.env.BETTER_AUTH_SECRET!,
//   baseURL: process.env.BASE_URL || "http://localhost:3000",
//   socialProviders: {
//     google: {
//         clientId: process.env.GOOGLE_CLIENT_ID!,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     },
//   }
// })


// import { betterAuth } from "better-auth";


// export const auth = betterAuth({
//   secret: process.env.BETTER_AUTH_SECRET || "better-auth-secret-123456789-xxxx",
//   baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID || "55792718512-74qt5ig2kkjkb01tep06c84rmscepoab.apps.googleusercontent.com",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "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",
//     },
//   },
// });

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