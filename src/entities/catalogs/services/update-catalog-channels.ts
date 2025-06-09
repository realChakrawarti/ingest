import { YOUTUBE_CHANNELS_INFORMATION } from "~/shared/lib/api/youtube-endpoints";
import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

import { CatalogList } from "../models";

/**
 * This function updates the channels of a specific catalogId
 * @param userId
 * @param catalogId
 * @param channels
 */
export async function updateCatalogChannels(
  userId: string,
  catalogId: string,
  catalogPayload: any
) {
  const userRef = adminDb.collection(COLLECTION.users).doc(userId);
  const userCatalogRef = userRef.collection(COLLECTION.catalogs).doc(catalogId);

  const { channels } = catalogPayload;

  try {
    const channelsInfo = await getChannelsInfo(channels);

    await userCatalogRef.update({
      list: channelsInfo,
      updatedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to update catalog channels.";
  }
}

/**
 * Retrieves detailed information for a list of YouTube channels.
 *
 * @param channels - An array of YouTube channel IDs to fetch information for
 * @returns An array of channel metadata objects with ID, handle, title, description and logo
 *
 * @remarks
 * Fetches channel information from the YouTube API and transforms the response into a structured format.
 * Extracts key details such as channel title, description, custom URL and thumbnail.
 *
 * @throws {Error} If there's an issue fetching channel information from the YouTube API
 */
async function getChannelsInfo(channels: string[]) {
  const channelsInfo: CatalogList[] = [];
  // Create a separate doc with channels information, fetch from youtube API
  const response = await fetch(YOUTUBE_CHANNELS_INFORMATION(channels));
  const result = await response.json();

  const channelListItems = result?.items;

  for (let i = 0; i < channelListItems?.length; i++) {
    const channelData = channelListItems[i];

    channelsInfo.push({
      channelDescription: channelData.snippet.description,
      channelHandle: channelData.snippet.customUrl,
      channelId: channelData.id,
      channelLogo: channelData.snippet.thumbnails.medium.url,
      channelTitle: channelData.snippet.title,
      type: "channel",
    });
  }

  return channelsInfo;
}
