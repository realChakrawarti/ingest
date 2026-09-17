import { FieldValue } from "firebase-admin/firestore";

import type { ZYouTubeVideoMetadata } from "~/entities/youtube/models";

import { admin } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";

export async function addPickVideo(
  userId: string,
  pickId: string,
  videoData: ZYouTubeVideoMetadata
) {
  const pickRef = refs.picks.doc(pickId);
  const userPickRef = refs.userPicks(userId).doc(pickId);

  try {
    await admin.db.runTransaction(async (txn) => {
      const userPickSnap = await txn.get(userPickRef);
      const userPickData = userPickSnap.data();

      const currentTotalVideos = userPickData?.videoIds?.length || 0;

      txn.update(userPickRef, {
        updatedAt: new Date(),
        videoIds: FieldValue.arrayUnion(videoData.videoId),
      });

      txn.update(pickRef, {
        "data.totalVideos": currentTotalVideos + 1,
        "data.updatedAt": new Date(),
        "data.videos": FieldValue.arrayUnion(videoData),
      });
    });

    return "Video added successfully to the pick.";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to add video to the pick.";
  }
}