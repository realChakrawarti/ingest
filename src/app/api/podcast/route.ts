import type { NextRequest } from "next/server";

import { getPodcasts } from "~/entities/podcast/services/get-podcasts";

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

  const result = await getPodcasts(queryParam);

  if (result.success) {
    return NxResponse.success(
      `Podcast with query ${queryParam} was fetched successfully.`,
      result.data
    );
  }

  return NxResponse.fail(
    result.error,
    { code: "PODCAST_INDEX_FAILED", details: result.error },
    Status.BadRequest
  );
}