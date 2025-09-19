import { FieldValue } from "firebase-admin/firestore";

import { accountId, kv, namespaceId } from "~/shared/lib/cloudflare/kv-client";
import { refs } from "~/shared/lib/firebase/refs";
import Log from "~/shared/utils/terminal-logger";

import { syncTypes } from "../models";

export async function deleteSync(userId: string, syncId: string) {
  const userRef = refs.users.doc(userId);

  await userRef.update({
    syncId: FieldValue.delete(),
    updatedAt: new Date(),
  });

  try {
    syncTypes.forEach(
      async (type) =>
        await kv.values.delete(namespaceId, `${syncId}:${type}`, {
          account_id: accountId,
        })
    );
  } catch (err) {
    Log.fail(err);
  }
}
