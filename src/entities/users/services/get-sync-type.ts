import { accountId, kv, namespaceId } from "~/shared/lib/cloudflare/kv-client";
import Log from "~/shared/utils/terminal-logger";

import type { ZSyncTypes } from "../models";

export async function getSyncType(type: ZSyncTypes, syncId: string) {
  const key = `${syncId}:${type}`;
  try {
    const value = await kv.values.get(namespaceId, key, {
      account_id: accountId,
    });

    const metadata = (await kv.metadata.get(namespaceId, key, {
      account_id: accountId,
    })) as { metadata: { updatedAt: string } };

    const content = await value.json();
    return { ...content, ...metadata };
  } catch (err) {
    Log.fail(err);
    if (err instanceof Error) throw new Error(err.message);
  }
}
