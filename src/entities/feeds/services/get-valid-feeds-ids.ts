import type { ZFeedDocument, ZFeedValid } from "../models";

import { unstable_noStore } from "next/cache";

import { refs } from "~/shared/lib/firebase/refs";

export async function getValidFeedIds() {
  unstable_noStore();
  const feedListData: ZFeedValid[] = [];

  // Filter the feed, where totalVideos is greater than 0, isPublic is true, and pageviews are sorted 'desc'
  const validFeedQuery = refs.feeds
    .where("data.totalVideos", ">", 0)
    .where("isPublic", "==", true)
    .orderBy("pageviews", "desc")
    .limit(50);

  const querySnapshot = await validFeedQuery.get();
  if (querySnapshot.empty) {
    return feedListData;
  }

  const feedIds = querySnapshot.docs.map((feed) => feed.id);

  // Get the title and description of the page
  // Awaiting using a Promise.all is done to wait for the map to execute before returning the response
  await Promise.all(
    feedIds.map(async (feedId) => {
      const feedData = await getFeedMetadata(feedId);
      if (feedData) {
        const metaData = {
          description: feedData?.description,
          id: feedId,
          isPublic: feedData?.isPublic,
          pageviews: feedData.pageviews ?? 0,
          thumbnails: getVideoThumbnails(feedData),
          title: feedData?.title,
          totalPosts: feedData?.data.totalPosts,
          totalVideos: feedData?.data?.totalVideos,
          totalPodcasts: feedData?.data?.totalPodcasts,
          updatedAt: feedData?.data.updatedAt,
        };

        feedListData.push(metaData);
      }
    })
  );

  return feedListData;
}

const getFeedMetadata = async (feedId: string) => {
  const feedRef = refs.feeds.doc(feedId);
  const feedSnap = await feedRef.get();
  const feedData = feedSnap.data();
  return feedData;
};

const getVideoThumbnails = (feedData: ZFeedDocument) => {
  const videos = feedData.data.videos;
  const dayThumbnails = videos?.day.map((video) => video.videoThumbnail) ?? [];
  const weekThumbnails =
    videos?.week.map((video) => video.videoThumbnail) ?? [];
  const monthThumbnails =
    videos?.month.map((video) => video.videoThumbnail) ?? [];
  return [...dayThumbnails, ...weekThumbnails, ...monthThumbnails];
};