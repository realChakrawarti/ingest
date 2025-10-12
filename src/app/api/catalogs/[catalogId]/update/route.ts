import type { NextRequest } from "next/server";

import { updateCatalogMeta, type CatalogUpdateResult } from "~/entities/catalogs";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;

  // Validate catalog ID parameter
  if (!catalogId || catalogId.trim() === '') {
    return NxResponse.fail(
      "Missing or invalid catalog ID in request path.",
      { code: "INVALID_PARAM", details: "catalogId parameter is required." },
      400
    );
  }

  // Parse JSON payload with error handling
  let payload: Record<string, unknown>;
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
  let result: CatalogUpdateResult;
  try {
    result = await updateCatalogMeta(catalogId, payload);
  } catch (_error) {
    return NxResponse.fail(
      "An unexpected error occurred while updating the catalog.",
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

  return NxResponse.success(result.message, {}, result.statusCode ?? 200);
}
