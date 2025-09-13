import type { NextRequest } from "next/server";

import { createSession, getSession, updateSession } from "~/entities/users";

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

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId") ?? "";

  if (sessionId) {
    const data = await getSession(sessionId);
    console.log(">>>data", data);
  }

  return NxResponse.success("OK", {}, 200);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();

  try {
    await updateSession(body);
    return NxResponse.success("Session was been synced with cloud.", {}, 201);
  } catch (err) {
    return NxResponse.fail(
      "Unable to update the session",
      { code: "SESSION_UPDATE_FAILED", details: JSON.stringify(err) },
      500
    );
  }
}
