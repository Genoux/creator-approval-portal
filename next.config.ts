import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    APP_VERSION: require("./package.json").version,
    BUILD_TIME: new Date().toISOString(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.fna.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "p16-sign-va.tiktokcdn.com",
      },
      {
        protocol: "https",
        hostname: "*.imginn.com",
      },
    ],
  },
};

export default nextConfig;
