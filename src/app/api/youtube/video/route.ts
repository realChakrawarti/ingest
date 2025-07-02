import type { NextRequest } from "next/server";

import { getVideoDetails } from "~/entities/youtube";

import { NxResponse } from "~/shared/lib/next/nx-response";

export async function GET(request: NextRequest) {
  const videoIdParam = request.nextUrl.searchParams.get("videoId");

  if (!videoIdParam) {
    return NxResponse.fail(
      "VideoId not provided.",
      { code: "BAD_REQUEST", details: "VideoId not provided." },
      400
    );
  }

  try {
    const data = await getVideoDetails(videoIdParam);
    return NxResponse.success(
      `Channel associated with Video ID: ${videoIdParam} fetched successfully.`,
      data,
      200
    );
  } catch (err) {
    if (err instanceof Error) {
      return NxResponse.fail(
        err.message,
        { code: "YOUTUBE_API", details: err.message },
        400
      );
    }
  }
}
