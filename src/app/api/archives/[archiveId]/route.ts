import type { NextRequest } from "next/server";

import { getArchiveById } from "~/entities/archives";

import { NxResponse } from "~/shared/lib/next/nx-response";
import AppErrorCodes from "~/shared/utils/app-error-codes";
import { Status } from "~/shared/utils/http-status";

type ContextParams = {
  params: {
    archiveId: string;
  };
};

export async function GET(_request: NextRequest, ctx: ContextParams) {
  const { archiveId } = await ctx.params;

  const result = await getArchiveById(archiveId);

  if (result.success) {
    return NxResponse.success(
      `${archiveId} archive data fetched successfully.`,
      result.data,
      Status.Ok
    );
  }

  return NxResponse.fail(
    result.error,
    { code: AppErrorCodes.GET_ARCHIVE_BY_ID_FAILED, details: result.error },
    Status.BadRequest
  );
}
