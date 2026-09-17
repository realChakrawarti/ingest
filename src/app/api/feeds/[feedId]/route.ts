import type { NextRequest } from "next/server";

import { getFeedById } from "~/entities/feeds";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import AppErrorCodes from "~/shared/utils/app-error-codes";
import { Status } from "~/shared/utils/http-status";

type ContextParams = {
  params: Promise<{
    feedId: string;
  }>;
};

export async function GET(_request: NextRequest, ctx: ContextParams) {
  const { feedId } = await ctx.params;

  const userId = await getUserIdHeader();
  const result = await getFeedById(feedId, userId);

  if (result.success) {
    return NxResponse.success(
      `${feedId} feed data fetched successfully.`,
      result.data,
      Status.Ok
    );
  }

  return NxResponse.fail(
    result.error,
    {
      code: AppErrorCodes.GET_CATALOG_BY_ID_FAILED,
      details: result.error,
    },
    Status.BadRequest
  );
}