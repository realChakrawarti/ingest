import * as Sentry from "@sentry/nextjs";
import appConfig from "~/shared/app-config";
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,
  sendDefaultPii: false,
  tracesSampleRate: 1.0,
  enableLogs: true,
  release: appConfig.version,
});
