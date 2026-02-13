import type { NextRequest } from "next/server";

import { createArchive, getArchiveByUser } from "~/entities/archives";
import { ArchiveMetaSchema } from "~/entities/archives/models";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import AppErrorCodes from "~/shared/utils/app-error-codes";
import { Status } from "~/shared/utils/http-status";

export async function GET() {
  const userId = await getUserIdHeader();

  try {
    const data = await getArchiveByUser(userId);
    return NxResponse.success(
      "Archive data fetched successfully.",
      data,
      Status.Ok
    );
  } catch (err) {
    if (err instanceof Error) {
      return NxResponse.fail(err.message, {
        code: AppErrorCodes.GET_USER_ARCHIVE_FAILED,
        details: err.message,
      });
    }
    return NxResponse.fail(
      "Unable to retrieve user archives.",
      {
        code: AppErrorCodes.GET_USER_ARCHIVE_FAILED,
        details: "Unable to retrieve user archives.",
      },
      Status.InternalServerError
    );
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdHeader();

  const body = await request.json();

  const { success, error, data } = ArchiveMetaSchema.omit({
    lastUpdatedAt: true,
  }).safeParse(body);

  if (success) {
    const archiveId = await createArchive(userId, data);

    return NxResponse.success<{ archiveId: string }>(
      "Archive created successfully.",
      { archiveId },
      Status.Created
    );
  }

  return NxResponse.fail(
    "Invalid data provided.",
    { code: AppErrorCodes.INVALID_DATA_PROVIDED, details: error.message },
    Status.UnprocessableEntity
  );
}
