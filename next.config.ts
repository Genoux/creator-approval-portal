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
        hostname:
          "inbeat-project-creator-approval-portal.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "attachments.clickup.com",
      },
    ],
  },
};

export default nextConfig;
