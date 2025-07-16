// Refer: https://github.com/reddit-archive/reddit/wiki/OAuth2#application-only-oauth

import appConfig from "~/shared/app-config";

import { redditRequestHeaders } from "./reddit-header";

export const RedditUserAgent = `web:ingest.707x.in:v${appConfig.version} (by /u/CURVX)`;

export default async function getRedditAccessToken() {
  const CLIENT_ID = process.env.REDDIT_CLIENT_ID;
  const CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64"
  );

  const redditAuthUrl = "https://www.reddit.com/api/v1/access_token";

  const requestBody = new URLSearchParams({
    grant_type: "client_credentials",
  });

  const headers = redditRequestHeaders();
  headers.set("Authorization", `Basic ${credentials}`);
  headers.set("Content-Type", "application/x-www-form-urlencoded");

  const result = await fetch(redditAuthUrl, {
    body: requestBody.toString(),
    headers: headers,
    method: "POST",
  });

  const data = await result.json();

  return data.access_token;
}
