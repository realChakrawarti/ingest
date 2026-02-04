import type { NextRequest } from "next/server";

import { updateArchiveMeta } from "~/entities/archives";
import { ArchiveMetaSchema } from "~/entities/archives/models";

import { NxResponse } from "~/shared/lib/next/nx-response";
import AppErrorCodes from "~/shared/utils/app-error-codes";
import { Status } from "~/shared/utils/http-status";

type ContextParams = {
  params: Promise<{
    archiveId: string;
  }>;
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const { archiveId } = await ctx.params;

  const body = await request.json();

  const { success, data, error } = ArchiveMetaSchema.omit({
    lastUpdatedAt: true,
  }).safeParse(body);

  if (success) {
    const result = await updateArchiveMeta(archiveId, data);

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
