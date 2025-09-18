import type { NextRequest } from "next/server";

import { updateSync } from "~/entities/users";
import { SyncTypesSchema } from "~/entities/users/models";

import { refs } from "~/shared/lib/firebase/refs";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const type = request.nextUrl.searchParams.get("type") ?? "";
  const syncId = request.nextUrl.searchParams.get("syncId") ?? "";

  if (!type || !syncId) {
    return NxResponse.fail(
      "Missing required query parameters",
      { code: "BAD_REQUEST", details: "Type & SyncId are required." },
      400
    );
  }

  const { error, data: safeType } = SyncTypesSchema.safeParse(type);

  if (error) {
    return NxResponse.fail(
      error.message,
      { code: "INVALID_SYNC_TYPE", details: error.message },
      422
    );
  }

  const userQuery = refs.users.where("syncId", "==", syncId).limit(1);

  const userSnapshot = await userQuery.get();

  if (userSnapshot.empty) {
    return NxResponse.fail(
      "Provided SyncID is not valid.",
      { code: "INVALID_SYNC_ID", details: "SyncID not valid" },
      422
    );
  }

  try {
    await updateSync(safeType, syncId, body);
    return NxResponse.success("Session was been synced with cloud.", {}, 201);
  } catch (err) {
    return NxResponse.fail(
      "Unable to update the session",
      {
        code: "SESSION_UPDATE_FAILED",
        details: err instanceof Error ? err.message : String(err),
      },
      500
    );
  }
}
