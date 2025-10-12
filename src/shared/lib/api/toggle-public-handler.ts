import type { NextRequest } from "next/server";
import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import type { PublicStatusUpdateResult } from "~/shared/lib/firebase/update-public-status";

interface TogglePublicStatusPayload {
  isPublic: boolean;
}

type ContextParams = {
  params: {
    [key: string]: string;
  };
};

type UpdateFunction = (entityId: string, isPublic: boolean) => Promise<PublicStatusUpdateResult>;
type OwnershipCheckFunction = (userId: string, entityId: string) => Promise<boolean>;

/**
 * Factory function to create toggle public status handlers for different entity types
 * 
 * @param updateFn - Function to update the entity's public status
 * @param ownershipCheckFn - Function to check if user owns the entity
 * @param entityName - Name of the entity (e.g., 'archive', 'catalog') for error messages
 * @param entityIdKey - Key to extract entity ID from context params (e.g., 'archiveId', 'catalogId')
 * @returns Next.js route handler function
 */
export function createTogglePublicHandler(
  updateFn: UpdateFunction,
  ownershipCheckFn: OwnershipCheckFunction,
  entityName: string,
  entityIdKey: string
) {
  return async function PATCH(request: NextRequest, ctx: ContextParams) {
    const entityId = ctx.params[entityIdKey];

    // Validate entity ID parameter
    if (!entityId || entityId.trim() === '') {
      return NxResponse.fail(
        `Missing or invalid ${entityName} ID in request path.`,
        { code: "INVALID_PARAM", details: `${entityIdKey} parameter is required.` },
        400
      );
    }

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

    // Authorization: Check if user owns this entity
    const isOwner = await ownershipCheckFn(userId, entityId);
    if (!isOwner) {
      return NxResponse.fail(
        `Access denied. You don't have permission to modify this ${entityName}.`,
        { code: "FORBIDDEN", details: `User does not own this ${entityName}.` },
        403
      );
    }

    // Parse JSON payload
    let payload: TogglePublicStatusPayload;
    try {
      payload = await request.json();
    } catch (_error) {
      return NxResponse.fail(
        "Failed to parse request body.", 
        { code: "INVALID_JSON", details: null }, 
        400
      );
    }
    
    if (typeof payload.isPublic !== 'boolean') {
      return NxResponse.fail(
        "Invalid payload. 'isPublic' must be a boolean.", 
        { code: "INVALID_PAYLOAD", details: null }, 
        400
      );
    }

    // Execute update function with proper error handling
    let result: PublicStatusUpdateResult;
    try {
      result = await updateFn(entityId, payload.isPublic);
    } catch (_error) {
      return NxResponse.fail(
        "An unexpected error occurred while updating the entity.",
        { code: "UPDATE_FAILED", details: null },
        500
      );
    }

    if (!result.success) {
      // Map error types to HTTP status codes
      switch (result.error) {
        case 'RATE_LIMIT':
          return NxResponse.fail(
            result.message,
            { code: "RATE_LIMIT_EXCEEDED", details: null },
            429
          );
        case 'NOT_FOUND':
          return NxResponse.fail(
            result.message,
            { code: "NOT_FOUND", details: null },
            404
          );
        case 'UPDATE_FAILED':
          return NxResponse.fail(
            result.message,
            { code: "UPDATE_FAILED", details: null },
            500
          );
        case 'NO_CHANGE':
          // No change is considered a successful response (idempotent)
          return NxResponse.success(result.message, {}, 200);
        default:
          return NxResponse.fail(
            result.message,
            { code: "UPDATE_FAILED", details: null },
            500
          );
      }
    }

    return NxResponse.success(result.message, {}, 200);
  };
}