import type { ZFeedChannel } from "../models";

import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

export async function deleteChannel(
  userId: string,
  feedId: string,
  channelToDelete: ZFeedChannel
) {
  const userFeedRef = refs.userFeeds(userId).doc(feedId);

  try {
    await userFeedRef.update({
      list: FieldValue.arrayRemove(channelToDelete),
      updatedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to delete the channel.";
  }
}