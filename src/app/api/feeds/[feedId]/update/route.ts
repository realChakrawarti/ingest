import type { NextRequest } from "next/server";

import { updateFeedMeta } from "~/entities/feeds";
import { FeedMetaSchema } from "~/entities/feeds/models";

import { NxResponse } from "~/shared/lib/next/nx-response";
import AppErrorCodes from "~/shared/utils/app-error-codes";
import { Status } from "~/shared/utils/http-status";

type ContextParams = {
  params: Promise<{
    feedId: string;
  }>;
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const { feedId } = await ctx.params;

  // Validate feedId route parameter
  if (!feedId || feedId.trim() === "") {
    return NxResponse.fail(
      "Missing or invalid Feed identifier.",
      {
        code: AppErrorCodes.INVALID_CATALOG_ID,
        details:
          "Feed identifier route parameter is required & cannot be empty.",
      },
      Status.BadRequest
    );
  }

  const body = await request.json();

  const { success, data, error } = FeedMetaSchema.omit({
    lastUpdatedAt: true,
  }).safeParse(body);

  if (success) {
    const result = await updateFeedMeta(feedId, data);

    if (result.success) {
      return NxResponse.success(result.data, {}, Status.Created);
    }

    return NxResponse.fail(
      result.error,
      { code: AppErrorCodes.INVALID_METADATA_UPDATE, details: result.error },
      Status.InternalServerError
    );
  }

  return NxResponse.fail(
    "Invalid data provided.",
    {
      code: AppErrorCodes.INVALID_DATA_PROVIDED,
      details: error?.message ?? "Failed to parse request payload.",
    },
    Status.UnprocessableEntity
  );
}