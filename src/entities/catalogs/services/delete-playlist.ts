import { doc, updateDoc } from "firebase/firestore";

import { db } from "~/shared/lib/firebase/client";
import { COLLECTION } from "~/shared/lib/firebase/collections";

/**
 * Removes specified playlists from a user's catalog.
 *
 * @param userId - The unique identifier of the user
 * @param catalogId - The unique identifier of the catalog to update
 * @param playlists - The updated list of playlists after deletion
 * @returns A promise that resolves when the catalog is updated
 *
 * @remarks
 * This function updates the playlists array in a user's catalog document and sets the update timestamp.
 */
export async function deletePlaylist(
  userId: string,
  catalogId: string,
  playlists: any
) {
  const userRef = doc(db, COLLECTION.users, userId);
  const userCatalogRef = doc(userRef, COLLECTION.catalogs, catalogId);

  await updateDoc(userCatalogRef, {
    playlists: playlists,
    updatedAt: new Date(),
  });
}
