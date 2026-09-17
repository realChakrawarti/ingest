import { revalidatePath } from "next/cache";

import { Timestamp } from "firebase-admin/firestore";

import appConfig from "~/shared/app-config";
import {
  generatePodcastIndexHeaders,
  PODCAST_EPISODE_BY_ID,
} from "~/shared/lib/api/podcast-index-endpoints";
import getRedditAccessToken, {
  redditRequestHeaders,
  SUBREDDIT_POSTS_HOT,
} from "~/shared/lib/api/reddit-endpoints";
import {
  YOUTUBE_CHANNEL_INFORMATION_BY_IDS,
  YOUTUBE_CHANNEL_PLAYLIST_VIDEOS,
  YOUTUBE_VIDEOS_DATA,
} from "~/shared/lib/api/youtube-endpoints";
import { YouTubePrefix } from "~/shared/lib/constants";
import { refs } from "~/shared/lib/firebase/refs";
import formatRedditImageLink from "~/shared/utils/format-reddit-image-link";
import Log from "~/shared/utils/terminal-logger";
import { time } from "~/shared/utils/time";

import {
  FeedPodcastItemSchema,
  type ZFeedChannel,
  type ZFeedList,
  type ZFeedPlaylist,
  type ZFeedPodcast,
  type ZFeedPodcastItem,
  type ZFeedSubreddit,
  type ZFeedSubredditPost,
  type ZFeedVideoListSchema,
  type ZContentByFeed,
  type ZVideoContentInfo,
  type ZVideoMetadataWithoutContent,
} from "../models";
import { getPageviewByFeedId } from "./get-pageviews-by-feed-id";

async function updateChannelLogos(
  list: Array<ZFeedChannel | ZFeedPlaylist>
): Promise<ZFeedList[]> {
  const channels = new Set<string>();
  list.forEach((item) => channels.add(item.channelId));

  const channelList = Array.from(channels);

  const channelLogos = new Map();
  if (channelList.length) {
    try {
      const result = await fetch(
        YOUTUBE_CHANNEL_INFORMATION_BY_IDS(channelList, 50)
      );
      const data = await result.json();

      if (data.items.length) {
        data.items.forEach((channel: any) => {
          const id = channel.id;
          const logo = channel.snippet.thumbnails.medium.url;

          channelLogos.set(id, logo);
        });
      }
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

export async function getFeedMeta(feedId: string) {
  const feedRef = refs.feeds.doc(feedId);
  const feedSnap = await feedRef.get();

  if (!feedSnap.exists) {
    return "Document doesn't exists";
  }

  const feedSnapData = feedSnap.data();

  Log.info("Feed metadata is being returned.");

  return {
    description: feedSnapData?.description,
    title: feedSnapData?.title,
  };
}

export async function getContentsByFeed(
  feedId: string
): Promise<ZContentByFeed | string> {
  const videoList: ZVideoMetadataWithoutContent[] = [];

  let videoFilterData: ZFeedVideoListSchema = {
    day: [],
    month: [],
    week: [],
  };

  let postResults: ZFeedSubredditPost[] | undefined = [];
  let podcastResults: ZFeedPodcastItem[] | undefined = [];
  let totalVideos = 0;

  const feedRef = refs.feeds.doc(feedId);
  const feedSnap = await feedRef.get();

  if (!feedSnap.exists) {
    return "Document doesn't exists";
  }

  const feedSnapData = feedSnap.data();

  const userFeedRef = feedSnapData?.videoRef;

  if (!userFeedRef) {
    return "Reference to the user doesn't exists";
  }

  const userFeedSnap = await userFeedRef.get();
  const userSnapData = userFeedSnap.data();
  const feedList = userSnapData?.list;

  const youtubeList =
    feedList?.filter(
      (item) => item.type === "channel" || item.type === "playlist"
    ) ?? [];
  const redditList =
    feedList?.filter((item) => item.type === "subreddit") ?? [];
  const podcastList = feedList?.filter((item) => item.type === "podcast") ?? [];

  // TODO: This is restrictive as feed must at-least have a channel/playlist, having only subreddit doesn't cut
  if (!youtubeList.length && !redditList.length) {
    return "Feed is empty.";
  }

  const channelListData =
    youtubeList.filter((item) => item.type === "channel") ?? [];
  const playlistData =
    youtubeList.filter((item) => item.type === "playlist") ?? [];

  const currentTime = Date.now();
  const lastUpdatedFeedList =
    userSnapData?.updatedAt.toDate().getTime() ?? currentTime;

  const timeDiffLogo = currentTime - lastUpdatedFeedList;

  const isChannelLogoUpdateRequired =
    timeDiffLogo > appConfig.channelLogoUpdatePeriod &&
    appConfig.feedUpdateEnabled;

  // Update channel logos
  if (isChannelLogoUpdateRequired) {
    const updatedList = await updateChannelLogos(youtubeList);
    // Update the YouTube list channel logos and keep the Reddit and podcast list intact
    await userFeedRef.set({
      list: [...updatedList, ...redditList, ...podcastList],
      updatedAt: Timestamp.fromDate(new Date()),
    });
  } else {
    Log.info("Too early to revalidate channels logo.");
  }

  // Get last updated, check if time has been 4 hours or not, if so make call to YouTube API and Reddit API
  // if not fetch from firestore
  const lastUpdated = feedSnapData?.data?.updatedAt.toDate();
  const lastUpdatedTime = lastUpdated.getTime();

  let recentUpdate = new Date(currentTime);
  let pageviews = 0;
  const timeDiffContent = currentTime - lastUpdatedTime;

  const isContentUpdateRequired =
    timeDiffContent > appConfig.feedUpdatePeriod && appConfig.feedUpdateEnabled;

  if (isContentUpdateRequired) {
    try {
      pageviews = await getPageviewByFeedId(feedId);
    } catch (err) {
      Log.fail(
        `Unable to fetch pageview for feed id ${feedId}\n${JSON.stringify(err)}`
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

    if (podcastList.length) {
      podcastResults = await getPodcastItems(podcastList);
    }

    const videoResults = await Promise.allSettled(videoListPromise);

    videoResults.forEach((result) => {
      if (result.status === "fulfilled") {
        videoList.push(...result.value);
      } else {
        Log.fail(
          `Unable to retrieve all the videos from the feed: ${feedId}: ${result.reason}`
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

    const feedContents = {
      data: {
        podcasts: podcastResults,
        posts: postResults,
        totalPosts: postResults.length,
        totalVideos: totalVideos,
        totalPodcasts: podcastResults.length,
        updatedAt: recentUpdate,
        videos: videoFilterData,
      },
      pageviews: pageviews,
    };

    await feedRef.set(feedContents, { merge: true });

    revalidatePath(`/c/${feedId}`);
    Log.info(`Cached invalidated /c/${feedId}`);
  } else {
    videoFilterData = feedSnapData?.data.videos;
    postResults = feedSnapData?.data.posts;
    podcastResults = feedSnapData?.data.podcasts;
    recentUpdate = lastUpdated;
    totalVideos = feedSnapData?.data?.totalVideos;
    pageviews = feedSnapData?.pageviews ?? 0;
    Log.info(
      `Returning cached data for the feed ${feedId}, next update on ${new Date(
        lastUpdatedTime + appConfig.feedUpdatePeriod
      )}`
    );
  }

  return {
    description: feedSnapData?.description,
    isPublic: feedSnapData?.isPublic,
    nextUpdate: new Date(
      recentUpdate.getTime() + appConfig.feedUpdatePeriod
    ).toUTCString(),
    pageviews: pageviews,
    posts: postResults ?? [],
    podcasts: podcastResults ?? [],
    title: feedSnapData?.title,
    totalPosts: postResults?.length ?? 0,
    totalPodcasts: podcastResults?.length ?? 0,
    totalVideos: totalVideos,
    videos: videoFilterData,
  };
}

async function getPodcastItems(list: ZFeedPodcast[]) {
  const podcastIndexHeaders = generatePodcastIndexHeaders();

  const podcastList: ZFeedPodcastItem[] = [];

  const since30days = Math.floor((Date.now() - time.days(30)) / 1000);

  try {
    const podcastPromises = list.map(async (item) => {
      const response = fetch(
        PODCAST_EPISODE_BY_ID(item.podcastId, since30days),
        {
          headers: podcastIndexHeaders,
        }
      );

      return {
        info: {
          podcastId: item.podcastId,
          podcastTitle: item.podcastTitle,
          podcastArtwork: item.podcastArtwork,
        },
        response: response,
      };
    });

    const podcastResults = await Promise.allSettled(podcastPromises);

    for (const result of podcastResults) {
      if (result.status === "fulfilled") {
        const { info, response } = result.value;
        const podcastItems = await (await response).json();

        if (podcastItems?.items?.length) {
          const {
            success,
            data: parsedPodcastItems,
            error,
          } = FeedPodcastItemSchema.array().safeParse(podcastItems?.items);
          if (success) {
            const refinedPodcastItems = parsedPodcastItems.map((item) => ({
              ...item,
              ...info,
            }));
            podcastList.push(...refinedPodcastItems);
          } else {
            Log.fail(error);
          }
        } else {
          Log.warn("No podcast items found.");
        }
      } else {
        Log.fail(result.reason);
      }
    }
  } catch (err) {
    Log.fail(err);
  }

  return podcastList;
}

async function getSubredditPosts(list: ZFeedSubreddit[]) {
  const accessToken = await getRedditAccessToken();

  const postList: ZFeedSubredditPost[] = [];
  try {
    const postPromises = list.map(async (item) => {
      const headers = redditRequestHeaders();
      headers.set("Authorization", `Bearer ${accessToken}`);

      return fetch(SUBREDDIT_POSTS_HOT(item.subredditName), {
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

            const postContentInfo: ZFeedSubredditPost = {
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
          Log.warn("The subreddits in the feed contains no posts.");
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

async function getPlaylistVideos(playlist: ZFeedPlaylist) {
  const items = await getVideosFromFeedItem(
    playlist.playlistId,
    playlist.channelLogo
  );
  return items;
}

async function getChannelVideos(channel: ZFeedChannel) {
  const playlistId = createPlaylistId(channel.channelId);
  const items = await getVideosFromFeedItem(playlistId, channel.channelLogo);
  return items;
}

async function getVideosFromFeedItem(playlistId: string, channelLogo: string) {
  const playlistItemData: ZVideoMetadataWithoutContent[] = [];
  try {
    const result = await fetch(
      YOUTUBE_CHANNEL_PLAYLIST_VIDEOS(playlistId, appConfig.feedVideoLimit)
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