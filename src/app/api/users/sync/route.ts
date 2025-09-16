import { createSyncId } from "~/entities/users";

import { refs } from "~/shared/lib/firebase/refs";
import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function GET() {
  const userId = getUserIdHeader();

  const userRef = refs.users.doc(userId);
  const userSnapshot = await userRef.get();

  const userData = userSnapshot.data();
  const syncId = userData?.syncId;

  if (syncId) {
    return NxResponse.success("User has the SyncID,", { syncId }, 200);
  }

  return NxResponse.fail(
    "No SyncID associated with the User",
    { code: "SYNC_ID_NOT_AVAILABLE", details: "SyncID not found" },
    404
  );
}

// https://developers.cloudflare.com/api/node/resources/kv/
export async function POST() {
  const userId = getUserIdHeader();
  try {
    await createSyncId(userId);
    return NxResponse.success("Created a session", {}, 200);
  } catch (err) {
    return NxResponse.fail(
      JSON.stringify(err),
      { code: "INTERNAL_SERVER_ERROR", details: "Something went wrong." },
      500
    );
  }
}
