import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

import type { ZCatalogPlaylist } from "../models";

export async function deletePlaylist(
  userId: string,
  catalogId: string,
  playlistToDelete: ZCatalogPlaylist
) {
  const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);

  try {
    await userCatalogRef.update({
      list: FieldValue.arrayRemove(playlistToDelete),
      updatedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to delete the playlist of the catalog.";
  }
}
