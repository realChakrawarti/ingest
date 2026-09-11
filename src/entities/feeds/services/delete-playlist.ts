import type { ZFeedPlaylist } from "../models";

import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

export async function deletePlaylist(
  userId: string,
  feedId: string,
  playlistToDelete: ZFeedPlaylist
) {
  const userFeedRef = refs.userFeeds(userId).doc(feedId);

  try {
    await userFeedRef.update({
      list: FieldValue.arrayRemove(playlistToDelete),
      updatedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to delete the playlist of the feed.";
  }
}