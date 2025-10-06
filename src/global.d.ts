import { z } from "zod";

const envVariables = z.object({
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_API_TOKEN: z.string(),
  CLOUDFLARE_KV_NAMESPACE_ID: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  GOOGLE_ANALYTICS_PRIVATE_KEY: z.string(),
  GOOGLE_ANALYTICS_PROPERTY_ID: z.string(),
  GOOGLE_CLIENT_EMAIL: z.string(),
  NEXT_PUBLIC_API_BASE_URL: z.string(),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  OCTOKIT_API: z.string(),
  REDDIT_CLIENT_ID: z.string(),
  REDDIT_CLIENT_SECRET: z.string(),
  YOUTUBE_API_KEY: z.string(),
  SENTRY_LOGGER: z.boolean(),
  SENTRy_CI: z.boolean(),
  SENTRy_PROJECT: z.string(),
  SENTRy_ORG: z.string(),
  NEXT_PUBLIC_SENTRY_DSN: z.string(),
  SENTRy_AUTH_TOKEN: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
