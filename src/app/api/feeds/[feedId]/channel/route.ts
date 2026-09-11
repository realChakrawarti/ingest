import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { deleteChannel, updateFeedChannels } from "~/entities/feeds";
import { FeedChannelSchema } from "~/entities/feeds/models";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: Promise<{
    feedId: string;
  }>;
};

export async function DELETE(request: NextRequest, ctx: ContextParams) {
  const userId = await getUserIdHeader();
  const { feedId } = await ctx.params;

  const body = await request.json();

  const { success, error, data } = FeedChannelSchema.safeParse(body);

  if (success) {
    await deleteChannel(userId, feedId, data);
    revalidatePath(`/c/${feedId}`);
    return NxResponse.success("Channel deleted successfully.", {}, 200);
  }
  return NxResponse.fail(
    "Invalid data provided.",
    { code: "INVALID_DATA", details: error.message },
    422
  );
}

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

  const { success, data, error } = FeedChannelSchema.safeParse(body);

  if (success) {
    const message = await updateFeedChannels(userId, feedId, data);

    if (message) {
      return NxResponse.fail(
        message,
        { code: "CATALOG_UPDATE_FAILED", details: message },
        400
      );
    }

    return NxResponse.success("Channel list updated successfully.", {}, 201);
  }
  return NxResponse.fail(
    "Invalid data provided.",
    { code: "INVALID_DATA", details: error.message },
    422
  );
}