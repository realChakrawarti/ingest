/* eslint-disable */
import { z } from "zod";

const envVariables = z.object({
  GOOGLE_ANALYTICS_PRIVATE_KEY: z.string(),
  GOOGLE_ANALYTICS_PROPERTY_ID: z.string(),
  GOOGLE_CLIENT_EMAIL: z.string(),
  NEXT_PUBLIC_API_BASE_URL: z.string(),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
  OCTOKIT_API: z.string(),
  YOUTUBE_API_KEY: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
