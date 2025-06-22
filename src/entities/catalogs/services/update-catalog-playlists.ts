import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

import type { CatalogList } from "../models";

export async function updateCatalogPlaylists(
  userId: string,
  catalogId: string,
  playlists: CatalogList<"playlist">[]
) {
  const userRef = adminDb.collection(COLLECTION.users).doc(userId);
  const userCatalogRef = userRef.collection(COLLECTION.catalogs).doc(catalogId);

  if (!playlists[0]?.channelId) {
    throw Error("Provided playlist doesn't contain any channel");
  }

  if (playlists.length) {
    await userCatalogRef.update({
      list: FieldValue.arrayUnion(...playlists),
      updatedAt: new Date(),
    });
  }
}
