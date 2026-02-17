import { headers } from "next/headers";

export async function getUserIdHeader(): Promise<string> {
  const headerStore = await headers();
  const userId = headerStore.get("userId");

  if (!userId) {
    throw Error("userId header is missing or empty!");
  }

  return userId;
}
