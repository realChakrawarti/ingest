import { FieldValue } from "firebase-admin/firestore";

import { ChannelPlaylist } from "~/entities/youtube/models";
import { YOUTUBE_CHANNELS_INFORMATION } from "~/shared/lib/api/youtube-endpoints";
import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

import { CatalogList } from "../models";

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
  playlists: ChannelPlaylist[]
) {
  const userRef = adminDb.collection(COLLECTION.users).doc(userId);
  const userCatalogRef = userRef.collection(COLLECTION.catalogs).doc(catalogId);
  const playlistsInfo: CatalogList[] = [];

  // TODO: Refactor: This looks inefficient, since channelID doesn't change, we could call the API once for details
  for (let i = 0; i < playlists.length; i++) {
    const { channelId } = playlists[i];
    const response = await fetch(YOUTUBE_CHANNELS_INFORMATION([channelId]));
    const result = await response.json();

    const channelData = result?.items[0];

    // TODO: Prior to adding, we could fetch channel details on UI /youtube endpoint 
    playlistsInfo.push({
      channelDescription: channelData.snippet.description,
      channelHandle: channelData.snippet.customUrl,
      channelId: playlists[i].channelId,
      channelLogo: channelData.snippet.thumbnails.medium.url,
      channelTitle: channelData.snippet.title,
      playlistDescription: playlists[i].playlistDescription,
      playlistId: playlists[i].playlistId,
      playlistTitle: playlists[i].playlistTitle,
      type: "playlist",
    });
  }

  await userCatalogRef.update({
    list: FieldValue.arrayUnion(...playlistsInfo),
    updatedAt: new Date(),
  });
}
