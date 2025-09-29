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
  org: process.env.SENTRI_ORG,
  project: process.env.SENTRI_PROJECT,
  silent: !process.env.SENTRI_CI,
  disableLogger: process.env.SENTRI_LOGGER,
  authToken: process.env.SENTRI_AUTH_TOKEN,
  widenClientFileUpload: true,
  tunnelRoute: true,
  automaticVercelMonitors: true,
  reactComponentAnnotation: {
    enabled: true,
  },
});
