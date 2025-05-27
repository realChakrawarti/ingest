import { headers } from "next/headers";

export function getUserIdHeader(): string {
  const headerStore = headers();
  const userId = headerStore.get("userId");

  if (!userId) {
    throw Error("userId header is missing or empty!");
  }

  return userId;
}
