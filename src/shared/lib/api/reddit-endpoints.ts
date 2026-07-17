import appConfig from "~/shared/app-config";

// Refer: https://github.com/reddit-archive/reddit/wiki/OAuth2#application-only-oauth
const RedditUserAgent = `web:ingest.707x.in:v${appConfig.version} (by /u/CURVX)`;

export function redditRequestHeaders(): Headers {
  const headers = new Headers();
  headers.set("User-Agent", RedditUserAgent);
  headers.set("Accept", "application/json");

  return headers;
}

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

export const SUBREDDIT_POSTS_HOT = (
  subredditName: string,
  limit: number = 15
) => `https://oauth.reddit.com/r/${subredditName}/hot.json?limit=${limit}`;

export const SUBREDDIT_SEARCH = (query: string, limit: number = 25) =>
  `https://oauth.reddit.com/subreddits/search.json?q=${query}&limit=${limit}&include_over_18=0`;

export const SUBREDDIT_POST_COMMENTS_TOP = (
  subreddit: string,
  postId: string,
  limit: number = 20
) =>
  `https://oauth.reddit.com/r/${subreddit}/comments/${postId}.json?limit=${limit}&sort=top`;