import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { z } from "zod";

import { deletePlaylist, updateFeedPlaylists } from "~/entities/feeds";
import { FeedPlaylistSchema } from "~/entities/feeds/models";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import Log from "~/shared/utils/terminal-logger";

type ContextParams = {
  params: Promise<{
    feedId: string;
  }>;
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const userId = await getUserIdHeader();
  const { feedId } = await ctx.params;

  if (!feedId) {
    return NxResponse.fail(
      "Feed ID is missing from request params.",
      {
        code: "BAD_REQUEST",
        details: "Feed ID is missing from request params.",
      },
      400
    );
  }

  const body = await request.json();

  const { success, data, error } = z.array(FeedPlaylistSchema).safeParse(body);

  if (success) {
    try {
      await updateFeedPlaylists(userId, feedId, data);
      return NxResponse.success("Playlist update successfully.", {}, 200);
    } catch (err) {
      if (err instanceof Error) {
        return NxResponse.fail(
          err.message,
          { code: "CATALOG_PLAYLIST_UPDATE", details: err.message },
          400
        );
      }
      return NxResponse.fail(
        "Unable to update feed playlists.",
        {
          code: "CATALOG_PLAYLIST_UPDATE",
          details: "Unable to update feed playlists.",
        },
        400
      );
    }
  } else {
    return NxResponse.fail(
      "Invalid data provided.",
      { code: "INVALID_DATA", details: error.message },
      422
    );
  }
}

export async function DELETE(request: NextRequest, ctx: ContextParams) {
  const userId = await getUserIdHeader();
  const { feedId } = await ctx.params;

  const body = await request.json();

  const { success, error, data } = FeedPlaylistSchema.safeParse(body);

  if (success) {
    try {
      await deletePlaylist(userId, feedId, data);
      revalidatePath(`/c/${feedId}`);
      return NxResponse.success("Playlist deleted successfully.", {}, 200);
    } catch (err) {
      Log.fail(err);
      return NxResponse.fail(
        "Unable to delete playlist from the feed.",
        {
          code: "PLAYLIST_DELETE_FAILED",
          details: "Unable to delete playlist from the feed.",
        },
        400
      );
    }
  } else {
    return NxResponse.fail(
      "Invalid data provided.",
      { code: "INVALID_DATA", details: error.message },
      422
    );
  }
}