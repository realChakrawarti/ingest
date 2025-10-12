import type { NextRequest } from "next/server";

import { checkCatalogOwnership, updateCatalogPublicStatus } from "~/entities/catalogs";
import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

interface TogglePublicStatusPayload {
  isPublic: boolean;
}

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;

  // Authentication: Get the current user from headers (set by middleware)
  let userId: string;
  try {
    userId = getUserIdHeader();
  } catch (error) {
    return NxResponse.fail(
      "Authentication required.",
      { code: "UNAUTHENTICATED", details: "No valid session found." },
      401
    );
  }

  // Authorization: Check if user owns this catalog
  const isOwner = await checkCatalogOwnership(userId, catalogId);
  if (!isOwner) {
    return NxResponse.fail(
      "Access denied. You don't have permission to modify this catalog.",
      { code: "FORBIDDEN", details: "User does not own this catalog." },
      403
    );
  }

  try {
    const payload: TogglePublicStatusPayload = await request.json();
    
    if (typeof payload.isPublic !== 'boolean') {
      return NxResponse.fail(
        "Invalid payload. 'isPublic' must be a boolean.", 
        { code: "INVALID_PAYLOAD", details: null }, 
        400
      );
    }

    const message = await updateCatalogPublicStatus(catalogId, payload.isPublic);

    // Check if the message indicates an error (rate limit or other)
    if (message.includes("Rate limit exceeded")) {
      return NxResponse.fail(
        message, 
        { code: "RATE_LIMIT_EXCEEDED", details: null }, 
        429
      );
    }
    
    if (message.includes("not found")) {
      return NxResponse.fail(
        message, 
        { code: "NOT_FOUND", details: null }, 
        404
      );
    }
    
    if (message.includes("Unable to update")) {
      return NxResponse.fail(
        message, 
        { code: "UPDATE_FAILED", details: null }, 
        500
      );
    }

    // Only return success for known success messages
    if (
      message.includes("has been made") ||
      message.includes("already public") ||
      message.includes("already private")
    ) {
      return NxResponse.success(message, {}, 200);
    }

    // Treat unknown messages as failures
    return NxResponse.fail(
      message,
      { code: "UPDATE_FAILED", details: null },
      500
    );
  } catch (_error) {
    return NxResponse.fail(
      "Failed to parse request body.", 
      { code: "INVALID_JSON", details: null }, 
      400
    );
  }
}
