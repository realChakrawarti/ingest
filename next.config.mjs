/** @type {import('next').NextConfig} */

import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  // Shows logs of API calls made during development
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // reactStrictMode: false,
};

export default withSentryConfig(nextConfig, {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  outputFileTracingRoot: import.meta.dirname,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.SENTRY_CI,
  sourcemaps: {
    disable: !process.env.VERCEL,
  },
  tunnelRoute: "/sentry-report",
  webpack: {
    automaticVercelMonitors: true,
    reactComponentAnnotation: {
      enabled: true,
    },
    treeshake: {
      removeDebugLogging: process.env.SENTRY_LOGGER,
    },
  },
  widenClientFileUpload: true,
});
