import { z } from "zod";

export const envVariables = z.object({
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_API_TOKEN: z.string(),
  CLOUDFLARE_KV_NAMESPACE_ID: z.string(),
  ENABLE_CATALOG_UPDATE: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  FIREBASE_CLIENT_EMAIL: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  GOOGLE_ANALYTICS_PRIVATE_KEY: z.string(),
  GOOGLE_ANALYTICS_PROPERTY_ID: z.string(),
  GOOGLE_CLIENT_EMAIL: z.string(),
  NEXT_PUBLIC_API_BASE_URL: z.string(),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string(),
  NEXT_RUNTIME: z.enum(["nodejs", "edge"]),
  OCTOKIT_API: z.string(),
  REDDIT_CLIENT_ID: z.string(),
  REDDIT_CLIENT_SECRET: z.string(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_CI: z
    .enum(["true", "false"])
    .optional()
    .default("false")
    .transform((v) => v === "true"),
  SENTRY_LOGGER: z
    .enum(["true", "false"])
    .optional()
    .default("false")
    .transform((v) => v === "true"),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  YOUTUBE_API_KEY: z.string(),
  PODCAST_INDEX_AUTH_KEY: z.string().optional(),
  PODCAST_INDEX_SECRET_KEY: z.string().optional(),
});

export type EnvType = z.infer<typeof envVariables>;

envVariables.parse(process.env);