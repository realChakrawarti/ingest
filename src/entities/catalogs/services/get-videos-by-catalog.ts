import { DocumentReference } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import appConfig from "~/shared/app-config";
import {
  YOUTUBE_CHANNEL_PLAYLIST_VIDEOS,
  YOUTUBE_CHANNELS_INFORMATION,
} from "~/shared/lib/api/youtube-endpoints";
import { TimeMs } from "~/shared/lib/constants";
import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

import { CatalogList, UserCatalogDocument } from "../models";
import { getPageviewByCatalogId } from "./get-pageviews-by-catalog-id";

type VideoMetadata = {
  description: string;
  title: string;
  channelId: string;
  thumbnail: any;
  channelTitle: string;
  videoId: string;
  publishedAt: string;
  channelLogo: string;
};

type videoListData = {
  day: VideoMetadata[];
  week: VideoMetadata[];
  month: VideoMetadata[];
};

async function updateChannelLogos(list: CatalogList[]): Promise<CatalogList[]> {
  const channels = new Set<string>();
  list.forEach((item) => channels.add(item.channelId));

  const channelList = Array.from(channels);

  const channelLogos = new Map();
  if (channelList.length) {
    try {
      const result = await fetch(YOUTUBE_CHANNELS_INFORMATION(channelList, 50));
      const data = await result.json();

      data.items.length &&
        data.items.forEach((channel: any) => {
          const id = channel.id;
          const logo = channel.snippet.thumbnails.medium.url;

          channelLogos.set(id, logo);
        });
    } catch (err) {
      console.log("Unable to fetch channel details", err);
    }
  }

  return list.map((channel) => {
    return {
      ...channel,
      channelLogo: channelLogos.get(channel.channelId) ?? channel.channelLogo,
    };
  });
}

/**
 * Retrieves and manages video metadata for a specific catalog.
 *
 * @param catalogId - Unique identifier for the catalog
 * @returns Catalog video metadata, including filtered videos, pageviews, and update information
 *
 * @remarks
 * This function performs the following key operations:
 * - Checks if catalog exists
 * - Retrieves videos from associated channels and playlists
 * - Caches video data in Firestore
 * - Filters videos by publication time (day, week, month)
 * - Manages cache invalidation and update intervals
 *
 * @throws Will return error messages if catalog is empty or doesn't exist
 *
 * @beta
 */
export async function getVideosByCatalog(catalogId: string) {
  let videoList: VideoMetadata[] = [];
  let totalVideos: number = 0;

  let videoFilterData: videoListData = {
    day: [],
    month: [],
    week: [],
  };

  const catalogRef = adminDb.collection(COLLECTION.catalogs).doc(catalogId);
  const catalogSnap = await catalogRef.get();

  if (!catalogSnap.exists) {
    return "Document doesn't exists";
  }

  const catalogSnapData = catalogSnap.data();

  const userCatalogRef: DocumentReference = catalogSnapData?.videoRef;

  if (!userCatalogRef) {
    return "Reference to the user doesn't exists";
  }

  const userCatalogSnap = await userCatalogRef.get();
  const userSnapData = userCatalogSnap.data() as UserCatalogDocument;
  const catalogList = userSnapData?.list;

  if (!catalogList?.length) {
    return "Catalog is empty. Channel or playlist is yet to be added!";
  }

  const channelListData: CatalogList<"channel">[] = catalogList.filter(
    (item: CatalogList) => item.type === "channel"
  );

  const playlistData: CatalogList<"playlist">[] = catalogList.filter(
    (item: CatalogList) => item.type === "playlist"
  );

  const lastUpdatedCatalogList = new Date(
    userSnapData.updatedAt.toDate()
  ).getTime();

  const currentTime = Date.now();

  // TODO: Consider moving this to a remote flag for runtime customization ??
  if (currentTime - lastUpdatedCatalogList > TimeMs["12h"]) {
    // Get channel logos
    const updatedList = await updateChannelLogos(catalogList);
    await userCatalogRef.set({
      list: updatedList,
      updatedAt: new Date(),
    });
  }

  // Get last updated, check if time has been 6 hours or not, if so make call to YouTube API,
  // if not fetch from firestore
  const lastUpdated = catalogSnapData?.data?.updatedAt.toDate();
  const lastUpdatedTime = new Date(lastUpdated).getTime();

  let recentUpdate = new Date(currentTime);
  let pageviews = 0;

  if (currentTime - lastUpdatedTime > TimeMs["4h"]) {
    try {
      pageviews = await getPageviewByCatalogId(catalogId);
    } catch (err) {
      console.error(
        `Unable to fetch pageview for catalog id ${catalogId}\n${JSON.stringify(
          err
        )}`
      );
    }

    const videoListPromise: Promise<VideoMetadata[]>[] = [];

    if (playlistData?.length) {
      playlistData?.forEach((playlist) => {
        videoListPromise.push(getPlaylistVideos(playlist));
      });
    }

    if (channelListData?.length) {
      channelListData?.forEach((channel) => {
        videoListPromise.push(getChannelVideos(channel));
      });
    }

    const results = await Promise.allSettled(videoListPromise);

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        videoList.push(...result.value);
      } else {
        console.error(
          `Unable to retrieve all the videos from the catalog: ${catalogId}:`,
          result.reason
        );
      }
    });

    // Sort the videoList by time
    videoList.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

    // Filter by day (24 hour), week (7 days) and month (30 days)
    for (const video of videoList) {
      const videoPublishedAt = new Date(video.publishedAt).getTime();

      if (currentTime - videoPublishedAt < TimeMs["1d"]) {
        videoFilterData.day.push(video);
      } else if (currentTime - videoPublishedAt < TimeMs["1w"]) {
        videoFilterData.week.push(video);
      } else {
        videoFilterData.month.push(video);
        continue;
      }
    }

    const catalogVideos = {
      data: {
        totalVideos: videoList.length,
        updatedAt: recentUpdate,
        videos: videoFilterData,
      },
      pageviews: pageviews,
    };

    await catalogRef.set(catalogVideos, { merge: true });

    revalidatePath(`/c/${catalogId}`);
    console.log(`Cached invalidated /c/${catalogId}`);
  } else {
    videoFilterData = catalogSnapData?.data.videos;
    totalVideos = catalogSnapData?.data.totalVideos;
    recentUpdate = lastUpdated;
    console.log(
      `Returning cached data for the catalog ${catalogId}, next update on ${new Date(
        lastUpdatedTime + TimeMs["4h"]
      )}`
    );
  }

  return {
    description: catalogSnapData?.description,
    nextUpdate: new Date(recentUpdate.getTime() + TimeMs["4h"]).toUTCString(),
    pageviews: catalogSnapData?.pageviews ?? 0,
    title: catalogSnapData?.title,
    totalVideos: totalVideos,
    videos: videoFilterData,
  };
}

// TODO: Both `getPlaylistVideos` and `getChannelVideos` is doing similar things with different params.
// Consider merging the two as both are used to create the same video list for a catalog

/**
 * Retrieves videos from a specified YouTube playlist, filtering out private and older videos.
 *
 * @param playlist - The playlist object containing playlist details
 * @returns An array of video metadata for public videos published within the last 30 days
 *
 * @remarks
 * This function fetches playlist items from the YouTube API and applies the following filters:
 * - Excludes private videos
 * - Excludes videos older than 30 days
 *
 * @throws {Error} Logs any errors encountered during the API fetch process
 */
async function getPlaylistVideos(playlist: CatalogList<"playlist">) {
  const playlistItemData: VideoMetadata[] = [];
  try {
    const result = await fetch(
      YOUTUBE_CHANNEL_PLAYLIST_VIDEOS(
        playlist.playlistId,
        appConfig.catalogVideoLimit
      ),
      { cache: "no-store" }
    ).then((data) => data.json());

    const currentTime = Date.now();
    const playlistVideoItems = result.items;

    if (!playlistVideoItems.length) {
      console.warn(`No uploads found in the playlist: ${playlist.playlistId}.`);
      return playlistItemData;
    }

    for (const item of playlistVideoItems) {
      // Don't return video which are private, deleted (privacyStatusUnspecified) or are older than 30 days (ONE MONTH)
      const videoPublished = item.contentDetails?.videoPublishedAt;
      if (
        item.status.privacyStatus === "private" ||
        item.status.privacyStatus === "privacyStatusUnspecified" ||
        currentTime - new Date(videoPublished).getTime() > TimeMs["1m"]
      ) {
        continue;
      }

      playlistItemData.push({
        channelId: item.snippet.channelId,
        channelLogo: playlist.channelLogo,
        channelTitle: item.snippet.channelTitle,
        description: item.snippet.description,
        publishedAt: item.contentDetails.videoPublishedAt,
        thumbnail: item.snippet.thumbnails.medium,
        title: item.snippet.title,
        videoId: item.contentDetails.videoId,
      });
    }
  } catch (err) {
    console.error(err);
    throw new Error(
      `Failed to fetch videos of playlist id: ${
        playlist.playlistId
      }\n${JSON.stringify(err)}`
    );
  }

  return playlistItemData;
}

/**
 * Retrieves videos from a YouTube channel's uploads playlist.
 *
 * @param channel - The channel object containing channel details
 * @returns An array of video metadata for public videos published within the last 30 days
 *
 * @remarks
 * This function filters out private videos and videos older than 30 days from the channel's uploads playlist.
 * It uses the YouTube API to fetch playlist items and transforms them into a standardized video metadata format.
 *
 * @throws {Error} Logs any errors encountered during the API request
 */
async function getChannelVideos(channel: CatalogList<"channel">) {
  const playlistId = createPlaylistId(channel.channelId);
  const playlistItemData: VideoMetadata[] = [];
  try {
    const result = await fetch(
      YOUTUBE_CHANNEL_PLAYLIST_VIDEOS(playlistId, appConfig.catalogVideoLimit),
      { cache: "no-store" }
    ).then((data) => data.json());

    const currentTime = Date.now();
    const playlistVideoItems = result.items;

    if (!playlistVideoItems.length) {
      console.warn(`No uploads found in the playlist: ${playlistId}.`);
      return playlistItemData;
    }

    for (const item of playlistVideoItems) {
      // Don't return video which are private and or older than 30 days (ONE MONTH)
      const videoPublished = item.contentDetails?.videoPublishedAt;
      if (
        item.status.privacyStatus === "private" ||
        item.status.privacyStatus === "privacyStatusUnspecified" ||
        currentTime - new Date(videoPublished).getTime() > TimeMs["1m"]
      ) {
        continue;
      }

      playlistItemData.push({
        channelId: item.snippet.channelId,
        channelLogo: channel.channelLogo,
        channelTitle: item.snippet.channelTitle,
        description: item.snippet.description,
        publishedAt: item.contentDetails.videoPublishedAt,
        thumbnail: item.snippet.thumbnails.medium,
        title: item.snippet.title,
        videoId: item.contentDetails.videoId,
      });
    }
  } catch (err) {
    console.error(err);
    throw new Error(
      `Failed to fetch videos of playlist id: ${playlistId}\n${JSON.stringify(
        err
      )}`
    );
  }

  return playlistItemData;
}

/**
 * Generates a unique playlist ID based on a channel ID.
 *
 * @param channel - The original YouTube channel ID
 * @returns A modified playlist ID derived from the input channel ID
 *
 * @remarks
 * This function transforms a channel ID by replacing the second character with 'U',
 * which is a convention used by YouTube to generate playlist IDs from channel IDs.
 */
function createPlaylistId(channelId: string) {
  return channelId.substring(0, 1) + "U" + channelId.substring(2);
}
