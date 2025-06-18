import { NextRequest } from "next/server";

import { getChannelDetails } from "~/entities/youtube";
import { getChannelDetailsFromVideoId } from "~/entities/youtube/services/get-channel-details";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function GET(request: NextRequest) {
  const channelId = request.nextUrl.searchParams.get("channelId") ?? "";
  const channelHandle = request.nextUrl.searchParams.get("channelHandle") ?? "";
  const videoId = request.nextUrl.searchParams.get("videoId") ?? "";

  if (videoId) {
    try {
      const data = await getChannelDetailsFromVideoId(videoId);
      return NxResponse.success(
        `Channel associated with Video ID: ${videoId} fetched successfully.`,
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

  if (!channelId && !channelHandle) {
    return NxResponse.fail(
      "No channel Id or channel handle provided.",
      {
        code: "YOUTUBE_API_CHANNEL",
        details: "No channel Id or channel handle provided.",
      },
      400
    );
  }

  try {
    const data = await getChannelDetails({ channelHandle, channelId });
    return NxResponse.success(
      `Channel details fetched successfully.`,
      data,
      200
    );
  } catch (err) {
    if (err instanceof Error) {
      return NxResponse.fail(
        err.message,
        { code: "YOUTUBE_API_CHANNEL", details: err.message },
        400
      );
    }
  }
}
