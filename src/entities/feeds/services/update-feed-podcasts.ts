import type { ZFeedPodcast } from "../models";

import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

export async function updateFeedPodcasts(
  userId: string,
  feedId: string,
  podcasts: ZFeedPodcast[]
) {
  const userFeedRef = refs.userFeeds(userId).doc(feedId);

  if (podcasts?.length) {
    await userFeedRef.update({
      list: FieldValue.arrayUnion(...podcasts),
      updatedAt: new Date(),
    });
  }
}