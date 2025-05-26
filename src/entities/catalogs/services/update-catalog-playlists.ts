import { FieldValue } from "firebase-admin/firestore";

import { YOUTUBE_CHANNELS_INFORMATION } from "~/shared/lib/api/youtube-endpoints";
import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";
import { PlaylistItem } from "~/shared/types-schema/types";

/**
 * Updates the playlists for a specific user catalog by fetching additional channel information.
 *
 * @param userId - The unique identifier of the user
 * @param catalogId - The unique identifier of the catalog to update
 * @param playlists - An array of playlist items to be added to the catalog
 * @returns A promise that resolves when the catalog is updated with new playlist information
 *
 * @remarks
 * This function performs the following steps:
 * 1. Fetches channel details for each playlist's channel
 * 2. Enriches playlist items with channel metadata
 * 3. Updates the catalog document in Firestore with the new playlist information
 *
 * @throws {Error} If there are issues fetching channel information or updating Firestore
 */
export async function updateCatalogPlaylists(
  userId: string,
  catalogId: string,
  playlists: PlaylistItem[]
) {
  const userRef = adminDb.collection(COLLECTION.users).doc(userId);
  const userCatalogRef = userRef.collection(COLLECTION.catalogs).doc(catalogId);

  const playlistList = [];

  // TODO: Refactor: This looks inefficient
  for (let i = 0; i < playlists.length; i++) {
    const { channelId } = playlists[i];
    const response = await fetch(YOUTUBE_CHANNELS_INFORMATION([channelId]));
    const result = await response.json();

    const channelInfo = result?.items[0];

    const playlistItem = {
      channelDescription: channelInfo.snippet.description,
      channelHandle: channelInfo.snippet.customUrl,
      channelId: playlists[i].channelId,
      channelLogo: channelInfo.snippet.thumbnails.medium.url,
      channelTitle: channelInfo.snippet.title,
      description: playlists[i].description,
      id: playlists[i].id,
      publishedAt: playlists[i].publishedAt,
      title: playlists[i].title,
    };

    playlistList.push(playlistItem);
  }

  await userCatalogRef.update({
    playlists: FieldValue.arrayUnion(...playlistList),
    updatedAt: new Date(),
  });
}
