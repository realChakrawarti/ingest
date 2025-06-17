import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

import { CatalogList } from "../models";

export async function updateCatalogChannels(
  userId: string,
  catalogId: string,
  channel: CatalogList<"channel">
) {
  const userRef = adminDb.collection(COLLECTION.users).doc(userId);
  const userCatalogRef = userRef.collection(COLLECTION.catalogs).doc(catalogId);

  try {
    await userCatalogRef.update({
      list: FieldValue.arrayUnion(channel),
      updatedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to update catalog channels.";
  }
}
