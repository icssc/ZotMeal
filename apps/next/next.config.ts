import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uci.campusdish.com"
      }
    ],
  },
};

export default nextConfig;
