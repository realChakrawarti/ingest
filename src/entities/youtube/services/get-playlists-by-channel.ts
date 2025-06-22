// TODO: Limit no of recurive calls that could be made, probably limit result to 500, i.e; 10

import { YOUTUBE_CHANNEL_PLAYLISTS } from "~/shared/lib/api/youtube-endpoints";

import type { ChannelPlaylist } from "../models";

/**
 * Recursively retrieves all playlists for a given YouTube channel using pagination.
 *
 * @param channelId - The unique identifier of the YouTube channel
 * @param data - The current page of playlist data containing a potential nextPageToken
 * @param playlists - An array of previously fetched playlists
 * @returns A complete array of playlists from the specified channel
 *
 * @remarks
 * This function handles YouTube API pagination by recursively fetching playlist pages
 * until no more pages are available. It accumulates playlists across multiple API calls.
 */
async function getAllPlaylists(channelId: string, data: any, playlists: any[]) {
  const pageToken = data.nextPageToken;
  if (pageToken) {
    const response = await fetch(
      YOUTUBE_CHANNEL_PLAYLISTS(channelId, pageToken)
    );
    const result = await response.json();
    playlists = [...playlists, ...result.items];
    return await getAllPlaylists(channelId, result, playlists);
  }

  return playlists;
}

// TODO: Consider checking if a playlist has 0 items, hence don't take that into account
//  "contentDetails": {
// "itemCount": 0
// }

/**
 * Retrieves all playlists for a given YouTube channel.
 *
 * @param channelId - The unique identifier of the YouTube channel
 * @returns An array of playlist items from the specified channel
 * @throws {Error} If the API request fails, an error is thrown with the error message
 *
 * @remarks
 * This function performs a two-step process:
 * 1. Fetches the first page of playlists for the channel
 * 2. Recursively retrieves all subsequent pages of playlists
 *
 * @beta
 */
export async function getPlaylistsByChannel(channelId: string) {
  const response = await fetch(YOUTUBE_CHANNEL_PLAYLISTS(channelId));
  const firstPageData = await response.json();
  if (response.status === 200) {
    const playlistItems = firstPageData.items;
    const allPlaylistItems = await getAllPlaylists(
      channelId,
      firstPageData,
      playlistItems
    );

    const structuredResponse: ChannelPlaylist[] = allPlaylistItems.map(
      (item) => {
        return {
          channelId: item.snippet.channelId,
          channelTitle: item.snippet.channelTitle,
          playlistDescription: item.snippet.description,
          playlistId: item.id,
          playlistTitle: item.snippet.title,
          publishedAt: item.snippet.publishedAt,
          thumbnail: item.snippet.thumbnails.medium.url,
          videoCount: item.contentDetails.itemCount,
        };
      }
    );

    return structuredResponse;
  } else {
    throw Error(firstPageData.error.message);
  }
}
