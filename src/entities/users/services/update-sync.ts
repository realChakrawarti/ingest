import type { ZSyncTypes } from "../models";

import { accountId, kv, namespaceId } from "~/shared/lib/cloudflare/kv-client";

export async function updateSync(
  type: ZSyncTypes,
  syncId: string,
  data: string
) {
  await kv.values.update(namespaceId, `${syncId}:${type}`, {
    account_id: accountId,
    metadata: {
      updatedAt: new Date(),
    },
    value: data,
  });
}