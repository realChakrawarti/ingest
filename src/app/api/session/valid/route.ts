import type { NextRequest } from "next/server";

import { refs } from "~/shared/lib/firebase/refs";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function GET(request: NextRequest) {
  const syncId = request.nextUrl.searchParams.get("syncId");

  const userQuery = refs.users.where("sessionId", "==", syncId).limit(1);

  const userSnapshot = await userQuery.get();

  if (!userSnapshot.empty) {
    return NxResponse.success("Valid session found", {}, 200);
  } else {
    return NxResponse.fail(
      "SyncID didn't match any valid session. Generate after logging in.",
      { code: "SESSION_UNAVAILABLE", details: "SyncID not found." },
      400
    );
  }
}
