import { accountId, kv, namespaceId } from "~/shared/lib/cloudflare/kv-client";
import Log from "~/shared/utils/terminal-logger";

import type { ZSyncTypes } from "../models";

export async function getSessionType(type: ZSyncTypes, syncId: string) {
  try {
    const value = await kv.values.get(namespaceId, `${syncId}:${type}`, {
      account_id: accountId,
    });
    const content = await value.json();
    return content;
  } catch (err) {
    Log.fail(err);
    if (err instanceof Error) throw new Error(err.message);
  }
}
