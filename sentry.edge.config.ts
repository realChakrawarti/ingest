import * as Sentry from "@sentry/nextjs";
Sentry.init({
  dsn: process.env.SENTRI_DNS,
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  enableLogs: true,
});
