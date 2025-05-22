import { YOUTUBE_CHANNELS_INFORMATION } from "~/shared/lib/api/youtube-endpoints";
import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";
import { CatalogChannel } from "~/shared/types-schema/types";

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
      channels: channelsInfo,
      updatedAt: new Date(),
    });
  } catch (err) {
    console.error(err);
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
  const channelsInfo: CatalogChannel[] = [];
  // Create a separate doc with channels information, fetch from youtube API
  const response = await fetch(YOUTUBE_CHANNELS_INFORMATION(channels));
  const result = await response.json();

  const channelListItems = result?.items;

  for (let i = 0; i < channelListItems?.length; i++) {
    const channelInfo = channelListItems[i];

    channelsInfo.push({
      description: channelInfo.snippet.description,
      handle: channelInfo.snippet.customUrl,
      id: channelInfo.id,
      logo: channelInfo.snippet.thumbnails.medium.url,
      title: channelInfo.snippet.title,
    });
  }

  return channelsInfo;
}
