import { Timestamp } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import appConfig from "~/shared/app-config";
import {
  YOUTUBE_CHANNEL_INFORMATION_BY_IDS,
  YOUTUBE_CHANNEL_PLAYLIST_VIDEOS,
  YOUTUBE_VIDEOS_DATA,
} from "~/shared/lib/api/youtube-endpoints";
import { YouTubePrefix } from "~/shared/lib/constants";
import { refs } from "~/shared/lib/firebase/refs";
import getRedditAccessToken from "~/shared/lib/reddit/get-access-token";
import { redditRequestHeaders } from "~/shared/lib/reddit/reddit-header";
import formatRedditImageLink from "~/shared/utils/format-reddit-image-link";
import isDevelopment from "~/shared/utils/is-development";
import Log from "~/shared/utils/terminal-logger";
import { time } from "~/shared/utils/time";

import type {
  ZCatalogChannel,
  ZCatalogList,
  ZCatalogPlaylist,
  ZCatalogSubreddit,
  ZCatalogSubredditPost,
  ZCatalogVideoListSchema,
  ZContentByCatalog,
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

export async function getCatalogMeta(catalogId: string) {
  const catalogRef = refs.catalogs.doc(catalogId);
  const catalogSnap = await catalogRef.get();

  if (!catalogSnap.exists) {
    return "Document doesn't exists";
  }

  const catalogSnapData = catalogSnap.data();

  Log.info("Catalog metadata is being returned.");

  return {
    description: catalogSnapData?.description,
    title: catalogSnapData?.title,
  };
}

export async function getContentsByCatalog(
  catalogId: string
): Promise<ZContentByCatalog | string> {
  const videoList: ZVideoMetadataWithoutContent[] = [];

  let videoFilterData: ZCatalogVideoListSchema = {
    day: [],
    month: [],
    week: [],
  };

  let postResults: ZCatalogSubredditPost[] | undefined = [];
  let totalVideos = 0;

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

  const youtubeList =
    catalogList?.filter((item) => item.type !== "subreddit") ?? [];
  const redditList =
    catalogList?.filter((item) => item.type === "subreddit") ?? [];

  // TODO: This is restrictive as catalog must at-least have a channel/playlist, having only subreddit doesn't cut
  if (!youtubeList.length && !redditList.length) {
    return "Catalog is empty.";
  }

  const channelListData =
    youtubeList.filter((item) => item.type === "channel") ?? [];
  const playlistData =
    youtubeList.filter((item) => item.type === "playlist") ?? [];

  const currentTime = Date.now();
  const lastUpdatedCatalogList =
    userSnapData?.updatedAt.toDate().getTime() ?? currentTime;

  // Update channel logos
  if (
    currentTime - lastUpdatedCatalogList > appConfig.channelLogoUpdatePeriod &&
    !isDevelopment()
  ) {
    const updatedList = await updateChannelLogos(youtubeList);
    // Update the YouTube list channel logos and keep the Reddit list intact
    await userCatalogRef.set({
      list: [...updatedList, ...redditList],
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } else {
    Log.info("Too early to revalidate channels logo.");
  }

  // Get last updated, check if time has been 4 hours or not, if so make call to YouTube API and Reddit API
  // if not fetch from firestore
  const lastUpdated = catalogSnapData?.data?.updatedAt.toDate();
  const lastUpdatedTime = lastUpdated.getTime();

  let recentUpdate = new Date(currentTime);
  let pageviews = 0;

  if (
    currentTime - lastUpdatedTime > appConfig.catalogUpdatePeriod &&
    !isDevelopment()
  ) {
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

    if (playlistData.length) {
      playlistData.forEach((playlist) => {
        videoListPromise.push(getPlaylistVideos(playlist));
      });
    }

    if (channelListData.length) {
      channelListData.forEach((channel) => {
        videoListPromise.push(getChannelVideos(channel));
      });
    }

    if (redditList.length) {
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

    totalVideos = videoList.length;

    const videoIds = videoList.map((video) => video.videoId);

    const videoDetails = await addVideoMetaInformation(videoIds);

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
        totalVideos: totalVideos,
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
    totalVideos = catalogSnapData?.data?.totalVideos;
    pageviews = catalogSnapData?.pageviews ?? 0;
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
    pageviews: pageviews,
    posts: postResults ?? [],
    title: catalogSnapData?.title,
    totalPosts: postResults?.length ?? 0,
    totalVideos: totalVideos,
    videos: videoFilterData,
  };
}

async function getSubredditPosts(list: ZCatalogSubreddit[]) {
  const accessToken = await getRedditAccessToken();

  const postList: ZCatalogSubredditPost[] = [];
  try {
    const postPromises = list.map(async (item) => {
      const redditUrl = `https://oauth.reddit.com/r/${item.subredditName}/hot.json?limit=15`;
      const headers = redditRequestHeaders();
      headers.set("Authorization", `Bearer ${accessToken}`);

      return fetch(redditUrl, {
        cache: "no-store",
        headers: headers,
      })
        .then((data) => {
          return data.json();
        })
        .catch((err) => Log.fail(err));
    });
    const postResults = await Promise.allSettled(postPromises);

    for (const result of postResults) {
      if (result.status === "fulfilled") {
        const allPosts = result.value?.data?.children?.map(
          (child: any) => child?.data
        );

        if (allPosts?.length) {
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
                formatRedditImageLink(item?.preview?.images[0]?.source?.url) ??
                "",
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
        } else {
          Log.warn("The subreddits in the catalog contains no posts.");
        }
      } else {
        Log.fail(result.reason);
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
        defaultVideoLanguage: "",
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
  return `${YouTubePrefix.VIDEOS}${channelId.substring(2)}`;
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

async function addVideoMetaInformation(videoIds: string[]) {
  const chunkedVideoIds = chunkVideoIds(videoIds, 50);
  const videoMetaInformation = new Map();

  const videoPromises = chunkedVideoIds.map((item) =>
    fetch(YOUTUBE_VIDEOS_DATA(item))
  );

  const results = await Promise.all(videoPromises);

  for (const result of results) {
    const data = await result.json();
    data.items.forEach((item: any) => {
      const videoContentInfo = {
        defaultVideoLanguage: item.snippet.defaultAudioLanguage ?? "",
        videoAvailability: item.snippet.liveBroadcastContent,
        videoComments: Number.parseInt(item.statistics.commentCount || "0"),
        videoDuration: youtubeDurationToSeconds(item.contentDetails.duration),
        videoLikes: Number.parseInt(item.statistics.likeCount || "0"),
        videoViews: Number.parseInt(item.statistics.viewCount || "0"),
      } satisfies ZVideoContentInfo;
      videoMetaInformation.set(item.id, videoContentInfo);
    });
  }
  return videoMetaInformation;
}

// TODO: PT is replaced with empty string which is fine for video duration within a day (less than 24 hours),
// but when its more than a day, the format is P#DT#H#M#S#, need to account for that too
function youtubeDurationToSeconds(duration: string) {
  if (!duration) {
    return 0;
  }

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  // Remove PT from string ref: https://developers.google.com/youtube/v3/docs/videos#contentDetails.duration
  let durationParsed = duration.replace("PT", "");

  // If the string contains hours parse it and remove it from the duration string
  if (durationParsed.indexOf("H") > -1) {
    const hours_split = durationParsed.split("H");
    hours = Number.parseInt(hours_split[0]);
    durationParsed = hours_split[1];
  }

  // If the string contains minutes parse it and remove it from the duration string
  if (durationParsed.indexOf("M") > -1) {
    const minutes_split = durationParsed.split("M");
    minutes = Number.parseInt(minutes_split[0]);
    durationParsed = minutes_split[1];
  }

  // If the string contains seconds parse it and remove it from the duration string
  if (durationParsed.indexOf("S") > -1) {
    const seconds_split = durationParsed.split("S");
    seconds = Number.parseInt(seconds_split[0]);
  }

  // Math the values to return seconds
  return hours * 60 * 60 + minutes * 60 + seconds;
}
