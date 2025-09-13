import { accountId, kv, namespaceId } from "~/shared/lib/cloudflare/kv-client";

export async function getSession(sessionId: string) {
  const sessionKeys = ["settings", "history", "watch-later", "favorites"];
  const sessionData = await kv.bulkGet(namespaceId, {
    account_id: accountId,
    keys: sessionKeys.map((key) => `${sessionId}:${key}`),
  });

  return sessionData;
}
