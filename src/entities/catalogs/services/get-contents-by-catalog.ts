import { Timestamp } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import appConfig from "~/shared/app-config";
import {
  YOUTUBE_CHANNEL_INFORMATION_BY_IDS,
  YOUTUBE_CHANNEL_PLAYLIST_VIDEOS,
  YOUTUBE_VIDEOS_DATA,
} from "~/shared/lib/api/youtube-endpoints";
import { refs } from "~/shared/lib/firebase/refs";
import formatRedditImageLink from "~/shared/utils/format-reddit-image-link";
import Log from "~/shared/utils/terminal-logger";
import { time } from "~/shared/utils/time";

import type {
  ZCatalogChannel,
  ZCatalogList,
  ZCatalogPlaylist,
  ZCatalogSubreddit,
  ZCatalogSubredditPost,
  ZCatalogVideoListSchema,
  ZVideoContentInfo,
  ZVideoMetadataWithoutContent,
} from "../models";
import { getPageviewByCatalogId } from "./get-pageviews-by-catalog-id";

async function updateChannelLogos(
  list: Array<ZCatalogChannel | ZCatalogPlaylist>
): Promise<ZCatalogList[]> {
  const channels = new Set<string>();
  list.forEach((item) => channels.add(item.channelId));

  const channelList = Array.from(channels);

  const channelLogos = new Map();
  if (channelList.length) {
    try {
      const result = await fetch(
        YOUTUBE_CHANNEL_INFORMATION_BY_IDS(channelList, 50),
        { cache: "no-store" }
      );
      const data = await result.json();

      data.items.length &&
        data.items.forEach((channel: any) => {
          const id = channel.id;
          const logo = channel.snippet.thumbnails.medium.url;

          channelLogos.set(id, logo);
        });
    } catch (err) {
      Log.fail(`Unable to fetch channel details ${err}`);
    }
  }

  return list.map((channel) => {
    return {
      ...channel,
      channelLogo: channelLogos.get(channel.channelId) ?? channel.channelLogo,
    };
  });
}

export async function getContentsByCatalog(catalogId: string) {
  const videoList: ZVideoMetadataWithoutContent[] = [];

  let videoFilterData: ZCatalogVideoListSchema | undefined = {
    day: [],
    month: [],
    week: [],
  };

  let postResults: ZCatalogSubredditPost[] | undefined = [];

  const catalogRef = refs.catalogs.doc(catalogId);
  const catalogSnap = await catalogRef.get();

  if (!catalogSnap.exists) {
    return "Document doesn't exists";
  }

  const catalogSnapData = catalogSnap.data();

  const userCatalogRef = catalogSnapData?.videoRef;

  if (!userCatalogRef) {
    return "Reference to the user doesn't exists";
  }

  const userCatalogSnap = await userCatalogRef.get();
  const userSnapData = userCatalogSnap.data();
  const catalogList = userSnapData?.list;

  const youtubeList = catalogList?.filter((item) => item.type !== "subreddit");
  const redditList = catalogList?.filter((item) => item.type === "subreddit");

  // TODO: This is restrictive as catalog must at-least have a channel/playlist, having only subreddit doesn't cut
  if (!youtubeList?.length) {
    return "Catalog is empty.";
  }

  const channelListData = youtubeList.filter((item) => item.type === "channel");
  const playlistData = youtubeList.filter((item) => item.type === "playlist");

  const currentTime = Date.now();
  const lastUpdatedCatalogList =
    userSnapData?.updatedAt.toDate().getTime() ?? currentTime;

  // Update channel logos
  if (
    currentTime - lastUpdatedCatalogList >
    appConfig.channelLogoUpdatePeriod
  ) {
    const updatedList = await updateChannelLogos(youtubeList);
    await userCatalogRef.set({
      list: updatedList,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } else {
    Log.info(`Too early to revalidate channels logo.`);
  }

  // Get last updated, check if time has been 4 hours or not, if so make call to YouTube API and Reddit API
  // if not fetch from firestore
  const lastUpdated = catalogSnapData?.data?.updatedAt.toDate();
  const lastUpdatedTime = lastUpdated.getTime();

  let recentUpdate = new Date(currentTime);
  let pageviews = 0;

  if (currentTime - lastUpdatedTime > appConfig.catalogUpdatePeriod) {
    try {
      pageviews = await getPageviewByCatalogId(catalogId);
    } catch (err) {
      Log.fail(
        `Unable to fetch pageview for catalog id ${catalogId}\n${JSON.stringify(
          err
        )}`
      );
    }

    const videoListPromise: Promise<ZVideoMetadataWithoutContent[]>[] = [];

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

    if (redditList?.length) {
      postResults = await getSubredditPosts(redditList);
    }

    const videoResults = await Promise.allSettled(videoListPromise);

    videoResults.forEach((result) => {
      if (result.status === "fulfilled") {
        videoList.push(...result.value);
      } else {
        Log.fail(
          `Unable to retrieve all the videos from the catalog: ${catalogId}: ${result.reason}`
        );
      }
    });

    // Sort the videoList by time
    videoList.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

    const videoIds = videoList.map((video) => video.videoId);

    const videoDetails = await addVideoDuration(videoIds);

    // Filter by day (24 hour), week (7 days) and month (30 days)
    for (const video of videoList) {
      const videoPublishedAt = new Date(video.publishedAt).getTime();

      const extraDetails = videoDetails.get(video.videoId);
      const updatedVideo = { ...video, ...extraDetails };
      if (currentTime - videoPublishedAt < time.days(1)) {
        videoFilterData.day.push(updatedVideo);
      } else if (currentTime - videoPublishedAt < time.weeks(1)) {
        videoFilterData.week.push(updatedVideo);
      } else {
        videoFilterData.month.push(updatedVideo);
      }
    }

    const catalogContents = {
      data: {
        posts: postResults,
        totalPosts: postResults.length,
        totalVideos: videoList.length,
        updatedAt: recentUpdate,
        videos: videoFilterData,
      },
      pageviews: pageviews,
    };

    await catalogRef.set(catalogContents, { merge: true });

    revalidatePath(`/c/${catalogId}`);
    Log.info(`Cached invalidated /c/${catalogId}`);
  } else {
    videoFilterData = catalogSnapData?.data.videos;
    postResults = catalogSnapData?.data.posts;
    recentUpdate = lastUpdated;
    Log.info(
      `Returning cached data for the catalog ${catalogId}, next update on ${new Date(
        lastUpdatedTime + appConfig.catalogUpdatePeriod
      )}`
    );
  }

  return {
    description: catalogSnapData?.description,
    nextUpdate: new Date(
      recentUpdate.getTime() + appConfig.catalogUpdatePeriod
    ).toUTCString(),
    posts: postResults,
    title: catalogSnapData?.title,
    videos: videoFilterData,
  };
}

async function getSubredditPosts(list: ZCatalogSubreddit[]) {
  const postList: ZCatalogSubredditPost[] = [];
  const postPromises = list.map((item) =>
    fetch(`https://www.reddit.com/r/${item.subredditName}/hot.json?limit=15`)
  );

  try {
    const postResults = await Promise.all(postPromises);

    for (const result of postResults) {
      const data = await result.json();

      const allPosts = data.data.children.map((child: any) => child.data);
      for (let i = 0; i < allPosts.length; i++) {
        const item = allPosts[i];

        // TODO: is_gallery checks if the post gallery, later integrate gallery?
        // Skips this iteration: 1 week older and the post is a gallery (collection of images)
        if (
          Date.now() / 1000 - item?.created_utc > time.weeks(1) / 1000 ||
          item?.is_gallery
        ) {
          continue;
        }

        const postContentInfo: ZCatalogSubredditPost = {
          postAuthor: item.author,
          postCommentsCount: item.num_comments,
          postCreatedAt: item?.created_utc,
          postDomain: item.domain ?? "",
          postId: item.id,
          postImage:
            formatRedditImageLink(item?.preview?.images[0]?.source?.url) ?? "",
          postPermalink: item.permalink,
          postSelftext: item.selftext ?? "",
          postThumbnail: formatRedditImageLink(item?.thumbnail) ?? "",
          postTitle: item.title,
          postType: item.post_hint ?? "",
          postUrl: item.url,
          postVideo: item?.media?.reddit_video?.fallback_url ?? "",
          postVotes: item.score,
          subreddit: item.subreddit,
        };

        postList.push(postContentInfo);
      }
    }
  } catch (err) {
    Log.fail(err);
  }

  return postList;
}

async function getPlaylistVideos(playlist: ZCatalogPlaylist) {
  const items = await getVideosFromCatalogItem(
    playlist.playlistId,
    playlist.channelLogo
  );
  return items;
}

async function getChannelVideos(channel: ZCatalogChannel) {
  const playlistId = createPlaylistId(channel.channelId);
  const items = await getVideosFromCatalogItem(playlistId, channel.channelLogo);
  return items;
}

async function getVideosFromCatalogItem(
  playlistId: string,
  channelLogo: string
) {
  const playlistItemData: ZVideoMetadataWithoutContent[] = [];
  try {
    const result = await fetch(
      YOUTUBE_CHANNEL_PLAYLIST_VIDEOS(playlistId, appConfig.catalogVideoLimit),
      { cache: "no-store" }
    ).then((data) => data.json());

    const currentTime = Date.now();
    const playlistVideoItems = result.items;

    if (!playlistVideoItems.length) {
      Log.warn(`No uploads found in the playlist: ${playlistId}.`);
      return playlistItemData;
    }

    for (const item of playlistVideoItems) {
      // Don't return video which are private and or older than 30 days (ONE MONTH)
      const videoPublished = item.contentDetails?.videoPublishedAt;
      if (
        item.status.privacyStatus === "private" ||
        item.status.privacyStatus === "privacyStatusUnspecified" ||
        currentTime - new Date(videoPublished).getTime() > time.days(30)
      ) {
        continue;
      }

      playlistItemData.push({
        channelId: item.snippet.channelId,
        channelLogo: channelLogo,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.contentDetails.videoPublishedAt,
        videoDescription: item.snippet.description,
        videoId: item.contentDetails.videoId,
        videoThumbnail: item.snippet.thumbnails.medium.url,
        videoTitle: item.snippet.title,
      });
    }
  } catch (err) {
    Log.fail(err);
    throw new Error(
      `Failed to fetch videos of playlist id: ${playlistId}\n${JSON.stringify(
        err
      )}`
    );
  }

  return playlistItemData;
}

function createPlaylistId(channelId: string) {
  return `${channelId.substring(0, 1)}U${channelId.substring(2)}`;
}

function chunkVideoIds(
  videoIds: string[],
  chunkSize: number,
  result: string[][] = []
) {
  // Base case: If the array is empty, return the accumulated result
  if (videoIds.length === 0) {
    return result;
  }

  const chunk = videoIds.splice(0, chunkSize);

  // Push the extracted chunk to our result array
  result.push(chunk);
  return chunkVideoIds(videoIds, chunkSize, result);
}

async function addVideoDuration(videoIds: string[]) {
  const chunkedVideoIds = chunkVideoIds(videoIds, 50);
  const videoIdsDuration = new Map();

  const videoPromises = chunkedVideoIds.map((item) =>
    fetch(YOUTUBE_VIDEOS_DATA(item))
  );

  const results = await Promise.all(videoPromises);

  for (const result of results) {
    const data = await result.json();
    data.items.forEach((item: any) => {
      const videoContentInfo: ZVideoContentInfo = {
        videoAvailability: item.snippet.liveBroadcastContent,
        videoComments: parseInt(item.statistics.commentCount || "0"),
        videoDuration: youtubeDurationToSeconds(item.contentDetails.duration),
        videoLikes: parseInt(item.statistics.likeCount || "0"),
        videoViews: parseInt(item.statistics.viewCount || "0"),
      } satisfies ZVideoContentInfo;
      videoIdsDuration.set(item.id, videoContentInfo);
    });
  }
  return videoIdsDuration;
}

function youtubeDurationToSeconds(duration: string) {
  if (!duration) {
    return 0;
  }

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  // Remove PT from string ref: https://developers.google.com/youtube/v3/docs/videos#contentDetails.duration
  duration = duration.replace("PT", "");

  // If the string contains hours parse it and remove it from our duration string
  if (duration.indexOf("H") > -1) {
    const hours_split = duration.split("H");
    hours = parseInt(hours_split[0]);
    duration = hours_split[1];
  }

  // If the string contains minutes parse it and remove it from our duration string
  if (duration.indexOf("M") > -1) {
    const minutes_split = duration.split("M");
    minutes = parseInt(minutes_split[0]);
    duration = minutes_split[1];
  }

  // If the string contains seconds parse it and remove it from our duration string
  if (duration.indexOf("S") > -1) {
    const seconds_split = duration.split("S");
    seconds = parseInt(seconds_split[0]);
  }

  // Math the values to return seconds
  return hours * 60 * 60 + minutes * 60 + seconds;
}
