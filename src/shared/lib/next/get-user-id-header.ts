import { headers } from "next/headers";

export function getUserIdHeader(): string {
  const headerStore = headers();
  const userId = headerStore.get("userId") || "";

  return userId;
}
