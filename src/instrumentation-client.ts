import * as Sentry from "@sentry/nextjs";
import appConfig from "./shared/app-config";
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  tracesSampleRate: appConfig.tracesSampleRate,
  // TODO: Assess whether it aligns with the requirement and check quota under free tier
  // integrations: [
  //   Sentry.replayIntegration(),
  //   Sentry.feedbackIntegration({
  //     colorScheme: "system",
  //   }),
  // ],
  // replaysSessionSampleRate: 0.1,
  // replaysOnErrorSampleRate: 1.0,
  enableLogs: true,
});
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
