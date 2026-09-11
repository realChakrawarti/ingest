import type { ZFeedMeta } from "../models";

import { Timestamp } from "firebase-admin/firestore";

import { admin } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";
import { createNanoidToken } from "~/shared/utils/nanoid-token";

export async function createFeed(
  userId: string,
  meta: Omit<ZFeedMeta, "lastUpdatedAt">
) {
  const nanoidToken = createNanoidToken(6);
  const feedRef = refs.feeds.doc(nanoidToken);

  // Add a doc to user -> feed collection
  const userFeedRef = refs.userFeeds(userId).doc(nanoidToken);

  const batch = admin.db.batch();

  try {
    // Create feed sub-collection
    batch.set(userFeedRef, {
      list: [],
      updatedAt: Timestamp.fromDate(new Date()),
    });

    // Add a doc to feed collection
    batch.set(feedRef, {
      data: {
        totalPosts: 0,
        totalVideos: 0,
        totalPodcasts: 0,
        updatedAt: Timestamp.fromDate(new Date(0)),
        videos: { day: [], month: [], week: [] },
      },
      description: meta.description,
      isPublic: meta.isPublic,
      lastUpdatedAt: Timestamp.now(),
      pageviews: 0,
      title: meta.title,
      videoRef: userFeedRef,
    });

    await batch.commit();

    return nanoidToken;
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to create the feed.";
  }
}