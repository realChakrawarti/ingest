import type { NextRequest } from "next/server";

import getRedditAccessToken, {
  redditRequestHeaders,
  SUBREDDIT_POST_COMMENTS_TOP,
} from "~/shared/lib/api/reddit-endpoints";
import { NxResponse } from "~/shared/lib/next/nx-response";
import { Status } from "~/shared/utils/http-status";

export async function GET(request: NextRequest) {
  const subredditParam = request.nextUrl.searchParams.get("subreddit");
  const postIdParam = request.nextUrl.searchParams.get("postId");

  if (!subredditParam || !postIdParam) {
    return NxResponse.fail(
      "Search query not provided.",
      { code: "BAD_REQUEST", details: "Search query not provided." },
      Status.BadRequest
    );
  }
  const accessToken = await getRedditAccessToken();

  const headers = redditRequestHeaders();
  headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(
    SUBREDDIT_POST_COMMENTS_TOP(subredditParam, postIdParam),
    {
      headers: headers,
    }
  );

  const data = await response.json();

  const results = data[1].data.children
    .filter(
      (child: any) => child.data.body && child.data.author !== "[deleted]"
    )
    .map((child: any) => child.data);

  return NxResponse.success(
    `Comments associated with postId ${postIdParam} was fetched successfully.`,
    results
  );
}