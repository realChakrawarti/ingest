import type { NextRequest } from "next/server";

import { updateArchiveMeta, type ArchiveUpdateResult } from "~/entities/archives";

import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    archiveId: string;
  };
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const { archiveId } = ctx.params;

  // Validate archive ID parameter
  if (!archiveId || archiveId.trim() === '') {
    return NxResponse.fail(
      "Missing or invalid archive ID in request path.",
      { code: "INVALID_PARAM", details: "archiveId parameter is required." },
      400
    );
  }

  // Parse JSON payload with error handling
  let payload: any;
  try {
    payload = await request.json();
  } catch (_error) {
    return NxResponse.fail(
      "Failed to parse request body.",
      { code: "INVALID_JSON", details: null },
      400
    );
  }

  // Execute update with proper error handling
  let result: ArchiveUpdateResult;
  try {
    result = await updateArchiveMeta(archiveId, payload);
  } catch (_error) {
    return NxResponse.fail(
      "An unexpected error occurred while updating the archive.",
      { code: "UPDATE_FAILED", details: null },
      500
    );
  }

  if (!result.success) {
    const statusCode = result.statusCode || 500;
    const errorCode = statusCode === 429 ? "RATE_LIMIT_EXCEEDED" : 
                     statusCode === 404 ? "NOT_FOUND" : "UPDATE_FAILED";
    
    return NxResponse.fail(
      result.message,
      { code: errorCode, details: null },
      statusCode
    );
  }

  return NxResponse.success(result.message, {}, result.statusCode || 201);
}
