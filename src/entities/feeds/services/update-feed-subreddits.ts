import type { ZFeedSubreddit } from "../models";

import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

export async function updateFeedSubreddits(
  userId: string,
  feedId: string,
  subreddits: ZFeedSubreddit[]
) {
  const userFeedRef = refs.userFeeds(userId).doc(feedId);

  if (subreddits?.length) {
    await userFeedRef.update({
      list: FieldValue.arrayUnion(...subreddits),
      updatedAt: new Date(),
    });
  }
}