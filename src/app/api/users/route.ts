import { NextRequest } from "next/server";

import { createUser } from "~/entities/users";
import { SESSION_COOKIE_NAME, TimeMs } from "~/shared/lib/constants";
import { adminAuth } from "~/shared/lib/firebase/admin";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  const sessionCookieOptions = {
    maxAge: TimeMs["12h"] / 1000, // 12 hours in seconds
    path: "/",
  };

  try {
    const userDetails = await adminAuth.verifyIdToken(token);
    const message = await createUser(userDetails.uid);
    const response = NxResponse.success<any>(message, {}, 201);

    const session = await adminAuth.createSessionCookie(token, {
      expiresIn: TimeMs["12h"],
    });

    response.cookies.set(SESSION_COOKIE_NAME, session, sessionCookieOptions);

    return response;
  } catch (err) {
    if (err instanceof Error) {
      return NxResponse.fail(
        "Unable to verify credentials. Please login again.",
        { code: "LOGIN_FAILED", details: err.message },
        401
      );
    }
    return NxResponse.fail(
      "Unable to verify credentials. Please login again.",
      { code: "LOGIN_FAILED", details: JSON.stringify(err) },
      401
    );
  }
}
