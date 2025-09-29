import * as Sentry from "@sentry/nextjs";
Sentry.init({
  dsn: process.env.SENTRI_DNS,
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({
      colorScheme: "system",
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enableLogs: true,
});
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
