import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { z } from "zod";

import { deletePodcast, updateFeedPodcasts } from "~/entities/feeds";
import { FeedPodcastSchema } from "~/entities/feeds/models";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import { Status } from "~/shared/utils/http-status";
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
      Status.BadRequest
    );
  }

  const body = await request.json();

  const { success, data, error } = z.array(FeedPodcastSchema).safeParse(body);

  if (success) {
    try {
      await updateFeedPodcasts(userId, feedId, data);
      return NxResponse.success("Podcast update successfully.", {}, 200);
    } catch (err) {
      if (err instanceof Error) {
        return NxResponse.fail(
          err.message,
          { code: "CATALOG_PODCAST_UPDATE", details: err.message },
          Status.BadRequest
        );
      }
      return NxResponse.fail(
        "Unable to update feed podcasts.",
        {
          code: "CATALOG_PODCAST_UPDATE",
          details: "Unable to update feed podcasts.",
        },
        Status.BadRequest
      );
    }
  } else {
    return NxResponse.fail(
      "Invalid data provided.",
      { code: "INVALID_DATA", details: error.message },
      Status.UnprocessableEntity
    );
  }
}

export async function DELETE(request: NextRequest, ctx: ContextParams) {
  const userId = await getUserIdHeader();
  const { feedId } = await ctx.params;

  const body = await request.json();

  const { success, error, data } = FeedPodcastSchema.safeParse(body);

  if (success) {
    try {
      await deletePodcast(userId, feedId, data);
      revalidatePath(`/c/${feedId}`);
      return NxResponse.success("Podcast deleted successfully.", {}, 200);
    } catch (err) {
      Log.fail(err);
      return NxResponse.fail(
        "Unable to delete podcast from the feed.",
        {
          code: "PODCAST_DELETE_FAILED",
          details: "Unable to delete podcast from the feed.",
        },
        Status.BadRequest
      );
    }
  } else {
    return NxResponse.fail(
      "Invalid data provided.",
      { code: "INVALID_DATA", details: error.message },
      Status.UnprocessableEntity
    );
  }
}