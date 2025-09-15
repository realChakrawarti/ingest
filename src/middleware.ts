import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "~/shared/lib/constants";
import { NxResponse } from "~/shared/lib/next/nx-response";
import Log from "~/shared/utils/terminal-logger";

import { verifyFirebaseSessionCookie } from "./shared/lib/firebase/verify-session-cookie";

const whiteListedEndpoints = [
  "/api/catalogs/valid",
  "/api/session/valid",
  "/api/session/update",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Allow this specific path to bypass middleware logic
  if (whiteListedEndpoints.includes(pathname)) {
    Log.info(`Whitelisted endpoint hit: ${pathname}`);
    return NextResponse.next();
  }

  const authSessionToken = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!authSessionToken) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NxResponse.fail(
        "No authentication session found.",
        {
          code: "NO_AUTH_SESSION_FOUND",
          details: "No authentication session found.",
        },
        401
      );
    }
    return NextResponse.redirect(new URL("/", request.url));
  }
  try {
    const decodeUserDetails =
      await verifyFirebaseSessionCookie(authSessionToken);
    const userId = decodeUserDetails.sub;
    if (userId) {
      request.headers.set("userId", userId);
    }
  } catch (err) {
    Log.fatal("Failed authorization on middleware", err);
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
    // Views
    "/dashboard",
    "/catalogs/:catalogId/edit",
    "/archives/:archiveId/edit",
    // Archives Routes
    "/api/archives",
    "/api/archives/:archiveId/add-video",
    "/api/archives/:archiveId/delete",
    "/api/archives/:archiveId/remove-video",
    "/api/archives/:archiveId/update",
    // Catalogs Routes
    "/api/catalogs",
    "/api/catalogs/:catalogId/",
    "/api/catalogs/:catalogId/channel",
    "/api/catalogs/:catalogId/delete",
    "/api/catalogs/:catalogId/playlist",
    "/api/catalogs/:catalogId/subreddit",
    "/api/catalogs/:catalogId/update",
    // YouTube Routes
    "/api/youtube/video",
    "/api/youtube/playlists",
    // User Routes
    "/api/logout",
    // User session
    "/api/session",
    "/api/session/user",
  ],
};
