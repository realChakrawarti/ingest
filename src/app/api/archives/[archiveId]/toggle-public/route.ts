import type { NextRequest } from "next/server";

import { updateArchivePublicStatus } from "~/entities/archives";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    archiveId: string;
  };
};

interface TogglePublicStatusPayload {
  isPublic: boolean;
}

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const { archiveId } = ctx.params;

  try {
    const payload: TogglePublicStatusPayload = await request.json();
    
    if (typeof payload.isPublic !== 'boolean') {
      return NxResponse.fail(
        "Invalid payload. 'isPublic' must be a boolean.", 
        { code: "INVALID_PAYLOAD", details: null }, 
        400
      );
    }

    const message = await updateArchivePublicStatus(archiveId, payload.isPublic);

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

    return NxResponse.success(message, {}, 200);
  } catch (error) {
    return NxResponse.fail(
      "Failed to parse request body.", 
      { code: "INVALID_JSON", details: null }, 
      400
    );
  }
}