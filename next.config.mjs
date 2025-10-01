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
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.SENTRY_CI,
  disableLogger: process.env.SENTRY_LOGGER,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  tunnelRoute: "?!sentry-report",
  automaticVercelMonitors: true,
  reactComponentAnnotation: {
    enabled: true,
  },
});
