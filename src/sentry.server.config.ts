import * as Sentry from "@sentry/nextjs";

import appConfig from "~/shared/app-config";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enableLogs: true,
  release: appConfig.version,
  sendDefaultPii: false,
  tracesSampleRate: appConfig.tracesSampleRate,
});
