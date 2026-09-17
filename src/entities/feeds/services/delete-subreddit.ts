import type { ZFeedSubreddit } from "../models";

import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

export async function deleteSubreddit(
  userId: string,
  feedId: string,
  subredditToDelete: ZFeedSubreddit
) {
  const userFeedRef = refs.userFeeds(userId).doc(feedId);

  try {
    await userFeedRef.update({
      list: FieldValue.arrayRemove(subredditToDelete),
      updatedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to delete the subreddit of the feed.";
  }
}