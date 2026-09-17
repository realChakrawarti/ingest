import type { NextRequest } from "next/server";

import { createPick, getPickByUser } from "~/entities/picks";
import { PickMetaSchema } from "~/entities/picks/models";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import AppErrorCodes from "~/shared/utils/app-error-codes";
import { Status } from "~/shared/utils/http-status";

export async function GET() {
  const userId = await getUserIdHeader();

  try {
    const data = await getPickByUser(userId);
    return NxResponse.success(
      "Pick data fetched successfully.",
      data,
      Status.Ok
    );
  } catch (err) {
    if (err instanceof Error) {
      return NxResponse.fail(err.message, {
        code: AppErrorCodes.GET_USER_PICK_FAILED,
        details: err.message,
      });
    }
    return NxResponse.fail(
      "Unable to retrieve user picks.",
      {
        code: AppErrorCodes.GET_USER_PICK_FAILED,
        details: "Unable to retrieve user picks.",
      },
      Status.InternalServerError
    );
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdHeader();

  const body = await request.json();

  const { success, error, data } = PickMetaSchema.omit({
    lastUpdatedAt: true,
  }).safeParse(body);

  if (success) {
    const pickId = await createPick(userId, data);

    return NxResponse.success<{ pickId: string }>(
      "Pick created successfully.",
      { pickId },
      Status.Created
    );
  }

  return NxResponse.fail(
    "Invalid data provided.",
    { code: AppErrorCodes.INVALID_DATA_PROVIDED, details: error.message },
    Status.UnprocessableEntity
  );
}
