import { FieldValue } from "firebase-admin/firestore";

import type { ZYouTubeVideoMetadata } from "~/entities/youtube/models";

import { admin } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";

export async function removePickVideo(
  userId: string,
  pickId: string,
  video: ZYouTubeVideoMetadata
) {
  const pickRef = refs.picks.doc(pickId);
  const userPickRef = refs.userPicks(userId).doc(pickId);

  const batch = admin.db.batch();

  try {
    const userPickSnap = await userPickRef.get();
    const userPickData = userPickSnap.data();

    const currentTotalVideos = userPickData?.videoIds?.length || 0;
    batch.update(userPickRef, {
      updatedAt: new Date(),
      videoIds: FieldValue.arrayRemove(video.videoId),
    });

    batch.update(pickRef, {
      "data.totalVideos": Math.max(0, currentTotalVideos - 1),
      "data.updatedAt": new Date(),
      "data.videos": FieldValue.arrayRemove(video),
    });

    await batch.commit();

    return "Video removed successfully.";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to remove video from pick.";
  }
}