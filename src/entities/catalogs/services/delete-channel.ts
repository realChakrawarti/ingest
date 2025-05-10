import { doc, updateDoc } from "firebase/firestore";

import { db } from "~/shared/lib/firebase/client";
import { COLLECTION } from "~/shared/lib/firebase/collections";

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
  channels: any[]
) {
  const userRef = doc(db, COLLECTION.users, userId);
  const userCatalogRef = doc(userRef, COLLECTION.catalogs, catalogId);

  await updateDoc(userCatalogRef, {
    channels: channels,
    updatedAt: new Date(),
  });
}
