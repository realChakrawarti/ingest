import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "./shared/lib/constants";
import { verifyFirebaseSessionCookie } from "./shared/lib/firebase/verify-session-cookie";
import { NxResponse } from "./shared/lib/next/nx-response";

export async function middleware(request: NextRequest) {
  const authSessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!authSessionToken) {
    return NxResponse.fail(
      "Not authorized.",
      { code: "UNAUTHORIZED", details: "Not authorized." },
      401
    );
  }
  try {
    const decodeUserDetails = await verifyFirebaseSessionCookie(
      authSessionToken
    );
    const userId = decodeUserDetails.sub;
    if (userId) {
      request.headers.set("userId", userId);
    }
  } catch (err) {
    console.error(err);
    return NxResponse.fail(
      "Unable to verify credentials.",
      { code: "VERIFICATION_FAILED", details: "Unable to verify credentials." },
      401
    );
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: [
    // Archives Routes
    "/api/archives/",
    "/api/archives/:archiveId/add-video",
    "/api/archives/:archiveId/delete",
    "/api/archives/:archiveId/remove-video",
    "/api/archives/:archiveId/update",
    // Catalogs Routes
    "/api/catalogs/",
    "/api/catalogs/:catalogId",
    "/api/catalogs/:catalogId/channel",
    "/api/catalogs/:catalogId/delete",
    "/api/catalogs/:catalogId/playlist",
    "/api/catalogs/:catalogId/update",
    "/api/catalogs/:catalogId/video",
    // YouTube Routes
    "/api/youtube/video",
    "/api/youtube/playlists",
    // User Routes
    "/api/logout",
  ],
};
