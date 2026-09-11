import type { ZFeedPlaylist } from "../models";

import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

export async function updateFeedPlaylists(
  userId: string,
  feedId: string,
  playlists: ZFeedPlaylist[]
) {
  const userFeedRef = refs.userFeeds(userId).doc(feedId);

  if (!playlists[0]?.channelId) {
    throw Error("Provided playlist doesn't contain any channel");
  }

  if (playlists.length) {
    await userFeedRef.update({
      list: FieldValue.arrayUnion(...playlists),
      updatedAt: new Date(),
    });
  }
}