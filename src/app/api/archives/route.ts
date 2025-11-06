import type { NextRequest } from "next/server";

import { createArchive, getArchiveByUser } from "~/entities/archives";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function GET() {
  const userId = getUserIdHeader();

  try {
    const data = await getArchiveByUser(userId);
    return NxResponse.success("Archive data fetched successfully.", data, 200);
  } catch (err) {
    if (err instanceof Error) {
      return NxResponse.fail(
        err.message,
        { code: "ARCHIVES_BY_USER_FAILED", details: err.message },
        400
      );
    }
    return NxResponse.fail(
      "Unable to retrieve user archives.",
      {
        code: "ARCHIVES_BY_USER_FAILED",
        details: "Unable to retrieve user archives.",
      },
      500
    );
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserIdHeader();

  const archiveMeta = await request.json();

  const archiveId = await createArchive(userId, archiveMeta);

  return NxResponse.success<{ archiveId: string }>(
    "Archive created successfully.",
    { archiveId },
    201
  );
}
