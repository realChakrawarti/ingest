import { refs } from "~/shared/lib/firebase/refs";
import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function GET() {
  const userId = getUserIdHeader();

  const userRef = refs.users.doc(userId);
  const userSnapshot = await userRef.get();

  const userData = userSnapshot.data();
  const syncId = userData?.sessionId;

  if (syncId) {
    return NxResponse.success("User has the SyncID,", { syncId: syncId }, 200);
  }

  return NxResponse.fail(
    "No SyncID associated with the User",
    { code: "SYNC_ID_NOT_AVAILABLE", details: "SyncID not found" },
    404
  );
}
