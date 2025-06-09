import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

import { CatalogList } from "../models";

/**
 * Removes specified channels from a user's catalog.
 *
 * @param userId - The unique identifier of the user
 * @param catalogId - The unique identifier of the catalog to update
 * @param channels - An array of channels to replace the existing channel list
 * @returns A promise that resolves when the catalog is updated
 */
export async function deleteChannel(
  userId: string,
  catalogId: string,
  channelToDelete: CatalogList
) {
  const userRef = adminDb.collection(COLLECTION.users).doc(userId);
  const userCatalogRef = userRef.collection(COLLECTION.catalogs).doc(catalogId);

  try {
    await userCatalogRef.update({
      list: FieldValue.arrayRemove(channelToDelete),
      updatedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to delete the channel.";
  }
}
