import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { z } from "zod";

import { deleteSubreddit, updateFeedSubreddits } from "~/entities/feeds";
import { FeedSubredditSchema } from "~/entities/feeds/models";

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

  const { success, data, error } = z.array(FeedSubredditSchema).safeParse(body);

  if (success) {
    try {
      await updateFeedSubreddits(userId, feedId, data);
      return NxResponse.success("Subreddit update successfully.", {}, 200);
    } catch (err) {
      if (err instanceof Error) {
        return NxResponse.fail(
          err.message,
          { code: "CATALOG_SUBREDDIT_UPDATE", details: err.message },
          Status.BadRequest
        );
      }
      return NxResponse.fail(
        "Unable to update feed subreddits.",
        {
          code: "CATALOG_SUBREDDIT_UPDATE",
          details: "Unable to update feed subreddits.",
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

  const { success, error, data } = FeedSubredditSchema.safeParse(body);

  if (success) {
    try {
      await deleteSubreddit(userId, feedId, data);
      revalidatePath(`/c/${feedId}`);
      return NxResponse.success("Subreddit deleted successfully.", {}, 200);
    } catch (err) {
      Log.fail(err);
      return NxResponse.fail(
        "Unable to delete subreddit from the feed.",
        {
          code: "SUBREDDIT_DELETE_FAILED",
          details: "Unable to delete subreddit from the feed.",
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