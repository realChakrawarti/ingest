import type { NextRequest } from "next/server";

import { updateArchiveVisibility } from "~/entities/archives";

import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
	params: {
		archiveId: string;
	};
};

export async function PATCH(request: NextRequest, ctx: ContextParams) {
	const { archiveId } = ctx.params;

	const payload = await request.json();
	const { isPublic } = payload;

	if (typeof isPublic !== "boolean") {
		return NxResponse.fail(
			"Invalid payload. isPublic must be a boolean.",
			{
				code: "INVALID_PAYLOAD",
				details: "Expected a boolean value for isPublic field",
			},
			400
		);
	}

	const result = await updateArchiveVisibility(archiveId, isPublic);

	if (!result.success) {
		return NxResponse.fail(
			result.message,
			{
				code: result.remainingTime
					? "RATE_LIMIT_ERROR"
					: "UPDATE_FAILED",
				details: result.remainingTime
					? `Please wait ${result.remainingTime} seconds before updating visibility again`
					: "Failed to update archive visibility",
			},
			400
		);
	}

	return NxResponse.success(
		result.message,
		{ remainingTime: result.remainingTime },
		200
	);
}
