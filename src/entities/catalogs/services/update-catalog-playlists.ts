import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

import type { CatalogList } from "../models";

export async function updateCatalogPlaylists(
  userId: string,
  catalogId: string,
  playlists: CatalogList<"playlist">[]
) {
  const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);

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
