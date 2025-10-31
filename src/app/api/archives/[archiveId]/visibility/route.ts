import type { NextRequest } from "next/server";
import { z } from "zod";

import { updateArchiveVisibility } from "~/entities/archives";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";

const VisibilityPayloadSchema = z.object({
  isPublic: z.boolean(),
});

type ContextParams = {
  params: {
    archiveId: string;
  };
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const userId = getUserIdHeader();
  const { archiveId } = ctx.params;

  // Validate archiveId route parameter
  if (!archiveId || archiveId.trim() === "") {
    return NxResponse.fail(
      "Missing or invalid archiveId",
      {
        code: "INVALID_ARCHIVE_ID",
        details: "archiveId route parameter is required and cannot be empty",
      },
      400
    );
  }

  const payload = await request.json();
  const parsed = VisibilityPayloadSchema.safeParse(payload);

  if (!parsed.success) {
    const formattedError = parsed.error.format();
    return NxResponse.fail(
      "Invalid payload. isPublic must be a boolean.",
      {
        code: "INVALID_PAYLOAD",
        details:
          formattedError.isPublic?._errors[0] ||
          "Expected a boolean value for isPublic field",
      },
      400
    );
  }

  const { isPublic } = parsed.data;

  const result = await updateArchiveVisibility(userId, archiveId, isPublic);

  if (!result.success) {
    return NxResponse.fail(
      result.message,
      {
        code: result.remainingTime ? "RATE_LIMIT_ERROR" : "UPDATE_FAILED",
        details: result.remainingTime
          ? `Please wait ${result.remainingTime} seconds before updating visibility again`
          : "Failed to update archive visibility",
      },
      result.remainingTime ? 429 : 400
    );
  }

  return NxResponse.success(
    result.message,
    { remainingTime: result.remainingTime },
    200
  );
}
