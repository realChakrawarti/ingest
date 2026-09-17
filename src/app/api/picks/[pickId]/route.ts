import type { NextRequest } from "next/server";

import { getPickById } from "~/entities/picks";

import { NxResponse } from "~/shared/lib/next/nx-response";
import AppErrorCodes from "~/shared/utils/app-error-codes";
import { Status } from "~/shared/utils/http-status";

type ContextParams = {
  params: Promise<{
    pickId: string;
  }>;
};

export async function GET(_request: NextRequest, ctx: ContextParams) {
  const { pickId } = await ctx.params;

  const result = await getPickById(pickId);

  if (result.success) {
    return NxResponse.success(
      `${pickId} pick data fetched successfully.`,
      result.data,
      Status.Ok
    );
  }

  return NxResponse.fail(
    result.error,
    { code: AppErrorCodes.GET_PICK_BY_ID_FAILED, details: result.error },
    Status.BadRequest
  );
}
