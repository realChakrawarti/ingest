import type { ZFeedByID } from "../models";

import { timestampUTC } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";
import { jsonResult } from "~/shared/utils/json-return";

export async function getFeedById(feedId: string, userId: string) {
  let feedResponseData: ZFeedByID = {
    description: "",
    isPublic: true,
    lastUpdatedAt: "",
    list: [],
    pageviews: 0,
    title: "",
  };

  const userFeedRef = refs.userFeeds(userId).doc(feedId);
  const feedRef = refs.feeds.doc(feedId);

  try {
    const userFeedData = await userFeedRef.get();
    const listData = userFeedData.data()?.list;

    // Get title and description
    const feedSnap = await feedRef.get();
    const feedData = feedSnap.data();

    if (feedData && listData) {
      feedResponseData = {
        description: feedData?.description,
        isPublic: feedData?.isPublic,
        lastUpdatedAt: timestampUTC(feedData?.lastUpdatedAt),
        list: listData,
        pageviews: feedData?.pageviews,
        title: feedData?.title,
      };
    }
  } catch (err) {
    if (err instanceof Error) {
      return jsonResult.error(err.message).return();
    }
    return jsonResult.error("Unable to retrieve feed by identifier.").return();
  }

  return jsonResult.success(feedResponseData).return();
}