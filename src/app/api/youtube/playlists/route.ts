import type { NextRequest } from "next/server";

import { getPlaylistsByChannel } from "~/entities/youtube";
import { NxResponse } from "~/shared/lib/next/nx-response";

/**
 * Handles GET requests to retrieve playlists for a specific YouTube channel.
 *
 * @param request - The incoming Next.js HTTP request containing the channel ID
 * @returns A response with either the fetched playlists or an error message
 *
 * @remarks
 * - Requires a `channelId` search parameter in the request URL
 * - Returns a 400 status code for missing or invalid channel ID
 * - Catches and handles errors from the YouTube API playlist retrieval
 *
 * @throws {NxResponse} Fails with a 400 status code if channel ID is missing or an error occurs
 */
export async function GET(request: NextRequest) {
  const channelId = request.nextUrl.searchParams.get("channelId");

  if (!channelId) {
    return NxResponse.fail(
      "Channel ID not provided.",
      { code: "BAD_REQUEST", details: "Channel ID not provided." },
      400
    );
  }

  try {
    const data = await getPlaylistsByChannel(channelId);

    return NxResponse.success(
      `Playlists associated with channel ID: ${channelId} fetched successfully.`,
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
    } else {
      return NxResponse.fail(
        "Unable to fetch playlists.",
        { code: "YOUTUBE_API", details: "Unable to fetch playlists." },
        400
      );
    }
  }
}
