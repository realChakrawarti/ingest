import { accountId, kv, namespaceId } from "~/shared/lib/cloudflare/kv-client";

import type { ZSyncTypes } from "../models";

export async function updateSession(
  type: ZSyncTypes,
  syncId: string,
  data: string
) {
  await kv.values.update(namespaceId, `${syncId}:${type}`, {
    account_id: accountId,
    value: data,
  });
}
