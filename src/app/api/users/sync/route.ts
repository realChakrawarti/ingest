import type { NextRequest } from "next/server";

import { createSyncId, deleteSync, getSyncId } from "~/entities/users";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";
import Log from "~/shared/utils/terminal-logger";

export async function DELETE(request: NextRequest) {
  const userId = await getUserIdHeader();
  const body = await request.json();

  const syncId = body?.syncId;

  if (!syncId) {
    return NxResponse.fail(
      "SyncID was not provided",
      { code: "INVALID_REQUEST", details: "No SyncID" },
      422
    );
  }

  try {
    await deleteSync(userId, syncId);
    return NxResponse.success("SyncID delete from the account.", {}, 201);
  } catch (err) {
    Log.fail(err);
    return NxResponse.fail(
      "Couldn't delete SyncID from the account.",
      {
        code: "UNABLE_REMOVE_SYNC_ID",
        details: err instanceof Error ? err.message : String(err),
      },
      500
    );
  }
}

export async function GET() {
  const userId = await getUserIdHeader();

  const syncId = await getSyncId(userId);

  if (syncId) {
    return NxResponse.success("User has the SyncID.", { syncId }, 200);
  }

  return NxResponse.fail(
    "No SyncID associated with the User",
    { code: "SYNC_ID_NOT_AVAILABLE", details: "SyncID not found." },
    404
  );
}

// https://developers.cloudflare.com/api/node/resources/kv/
export async function POST() {
  const userId = await getUserIdHeader();
  try {
    await createSyncId(userId);
    return NxResponse.success("Created a session.", {}, 200);
  } catch (err) {
    return NxResponse.fail(
      JSON.stringify(err),
      { code: "INTERNAL_SERVER_ERROR", details: "Something went wrong." },
      500
    );
  }
}
