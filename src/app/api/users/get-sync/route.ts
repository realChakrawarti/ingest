import type { NextRequest } from "next/server";

import { getSyncType } from "~/entities/users";
import { SyncTypesSchema } from "~/entities/users/models";

import { refs } from "~/shared/lib/firebase/refs";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") ?? "";
  const syncId = request.nextUrl.searchParams.get("syncId") ?? "";

  const userQuery = refs.users.where("syncId", "==", syncId).limit(1);

  const userSnapshot = await userQuery.get();

  if (userSnapshot.empty) {
    return NxResponse.fail(
      "Provided SyncID is not valid.",
      { code: "INVALID_SYNC_ID", details: "SyncID not valid" },
      422
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

  try {
    const data = await getSyncType(safeType, syncId);

    return NxResponse.success("Retrieved sync data successfully.", data, 200);
  } catch (err) {
    if (err instanceof Error)
      return NxResponse.fail(
        err.message,
        { code: "KEY_UNAVAILABLE", details: err.message },
        404
      );
  }
}
