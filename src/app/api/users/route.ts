import { NextRequest } from "next/server";

import { createUser } from "~/entities/users";
import { timeMs } from "~/shared/lib/constants";
import { NxResponse } from "~/shared/lib/next/nx-response";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const message = await createUser(requestBody.uid);

  const response = NxResponse.success<any>(message, {}, 201);

  response.cookies.set("userId", requestBody.uid, {
    maxAge: timeMs["12h"] / 1000, // 12 hours in seconds
    path: "/",
  });

  return response;
}
