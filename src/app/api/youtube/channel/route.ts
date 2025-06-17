import { NextRequest } from "next/server";

import { getChannelDetails } from "~/entities/youtube";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function GET(request: NextRequest) {
  const channelId = request.nextUrl.searchParams.get("channelId") ?? "";
  const channelHandle = request.nextUrl.searchParams.get("channelHandle") ?? "";

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
