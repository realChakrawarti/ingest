import type { NextRequest } from "next/server";

import getRedditAccessToken, {
  redditRequestHeaders,
  SUBREDDIT_SEARCH,
} from "~/shared/lib/api/reddit-endpoints";
import { NxResponse } from "~/shared/lib/next/nx-response";
import { Status } from "~/shared/utils/http-status";

export async function GET(request: NextRequest) {
  const queryParam = request.nextUrl.searchParams.get("q");

  if (!queryParam) {
    return NxResponse.fail(
      "Search query not provided.",
      { code: "BAD_REQUEST", details: "Search query not provided." },
      Status.BadRequest
    );
  }
  const accessToken = await getRedditAccessToken();

  const headers = redditRequestHeaders();
  headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(SUBREDDIT_SEARCH(queryParam), {
    headers: headers,
  });

  const data = await response.json();

  const results = data.data.children.map((child: any) => child.data);

  return NxResponse.success(
    `Subreddit with query ${queryParam} was fetched successfully.`,
    results
  );
}