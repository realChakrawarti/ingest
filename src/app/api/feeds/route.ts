import type { NextRequest } from "next/server";

import { createFeed, getFeedByUser } from "~/entities/feeds";
import { FeedMetaSchema } from "~/entities/feeds/models";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import AppErrorCodes from "~/shared/utils/app-error-codes";
import { Status } from "~/shared/utils/http-status";

export async function GET() {
  const userId = await getUserIdHeader();
  try {
    const data = await getFeedByUser(userId);
    return NxResponse.success(
      "Feeds data fetched successfully.",
      data,
      Status.Ok
    );
  } catch (err) {
    return NxResponse.fail(
      "Unable to retrieve user feeds.",
      {
        code: AppErrorCodes.GET_USER_CATALOG_FAILED,
        details:
          err instanceof Error ? err.message : "Unable to retrieve user feeds.",
      },
      Status.InternalServerError
    );
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdHeader();

  const body = await request.json();

  const { success, error, data } = FeedMetaSchema.omit({
    lastUpdatedAt: true,
  }).safeParse(body);

  if (success) {
    const feedId = await createFeed(userId, data);
    return NxResponse.success<{ feedId: string }>(
      "Feed created successfully.",
      { feedId },
      Status.Created
    );
  }
  return NxResponse.fail(
    "Invalid data provided.",
    { code: AppErrorCodes.INVALID_DATA_PROVIDED, details: error.message },
    Status.UnprocessableEntity
  );
}