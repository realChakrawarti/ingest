import { adminDb } from "~/shared/lib/firebase/admin";
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
  const userRef = adminDb.collection(COLLECTION.users).doc(userId);
  const userCatalogRef = userRef.collection(COLLECTION.catalogs).doc(catalogId);

  try {
    await userCatalogRef.update({
      playlists: playlists,
      updatedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to delete the playlist of the catalog.";
  }
}
