import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    APP_VERSION: require("./package.json").version,
    BUILD_TIME: new Date().toISOString(),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3phw8pj0ea6u1.cloudfront.net",
      },
      {
        protocol: "https",
        hostname:
          "inbeat-project-creator-approval-portal.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "d3phw8pj0ea6u1.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "attachments.clickup.com",
      },
    ],
  },
};

export default process.env.NODE_ENV === "development"
  ? nextConfig
  : withSentryConfig(nextConfig, {
      org: "inbeat-67",
      project: "javascript-nextjs",
      silent: !process.env.CI,
      widenClientFileUpload: true,
      tunnelRoute: "/monitoring",
      disableLogger: true,
      automaticVercelMonitors: true,
    });
