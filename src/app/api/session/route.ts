import { createSession } from "~/entities/users";

import { getUserIdHeader } from "~/shared/lib/next/get-user-id-header";
import { NxResponse } from "~/shared/lib/next/nx-response";

// https://developers.cloudflare.com/api/node/resources/kv/
export async function POST() {
  const userId = getUserIdHeader();
  try {
    await createSession(userId);
    return NxResponse.success("Created a session", {}, 200);
  } catch (err) {
    return NxResponse.fail(
      JSON.stringify(err),
      { code: "INTERNAL_SERVER_ERROR", details: "Something went wrong." },
      500
    );
  }
}
