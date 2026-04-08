import type { ZCatalogPlaylist } from "../models";

import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

export async function updateCatalogPlaylists(
  userId: string,
  catalogId: string,
  playlists: ZCatalogPlaylist[]
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