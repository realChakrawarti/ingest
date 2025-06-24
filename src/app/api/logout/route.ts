import { SESSION_COOKIE_NAME } from "~/shared/lib/constants";
import { NxResponse } from "~/shared/lib/next/nx-response";

export function GET() {
  const response = NxResponse.success("User logged out successfully.", {}, 200);

  response.cookies.delete({ name: SESSION_COOKIE_NAME, path: "/" });
  return response;
}
