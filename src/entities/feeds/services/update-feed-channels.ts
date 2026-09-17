import type { ZFeedChannel } from "../models";

import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

export async function updateFeedChannels(
  userId: string,
  feedId: string,
  channel: ZFeedChannel
) {
  const userFeedRef = refs.userFeeds(userId).doc(feedId);

  try {
    await userFeedRef.update({
      list: FieldValue.arrayUnion(channel),
      updatedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to update feed channels.";
  }
}