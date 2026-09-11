import type { ZFeedByUser } from "../models";

import { timestampUTC } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";
import Log from "~/shared/utils/terminal-logger";

export async function getFeedByUser(userId: string) {
  const userFeedsData: ZFeedByUser[] = [];

  const userFeedsCollectionRef = refs.userFeeds(userId);
  try {
    const userFeedsDoc = await userFeedsCollectionRef.get();

    if (userFeedsDoc.empty) {
      return userFeedsData;
    }

    const feedIds = userFeedsDoc.docs.map((doc) => doc.id);

    await Promise.all(
      feedIds.map(async (feedId) => {
        const feedRef = refs.feeds.doc(feedId);
        const feedSnap = await feedRef.get();
        const feedData = feedSnap.data();

        if (feedData) {
          userFeedsData.push({
            description: feedData.description,
            id: feedId,
            isPublic: feedData?.isPublic,
            title: feedData?.title,
            updatedAt: timestampUTC(feedData?.data?.updatedAt),
          });
        }
      })
    );
  } catch (err) {
    Log.fail(err);
  }

  return userFeedsData;
}
