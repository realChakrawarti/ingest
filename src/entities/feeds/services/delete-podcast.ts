import type { ZFeedPodcast } from "../models";

import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

export async function deletePodcast(
  userId: string,
  feedId: string,
  podcastToDelete: ZFeedPodcast
) {
  const userFeedRef = refs.userFeeds(userId).doc(feedId);

  try {
    await userFeedRef.update({
      list: FieldValue.arrayRemove(podcastToDelete),
      updatedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to delete the podcast of the feed.";
  }
}