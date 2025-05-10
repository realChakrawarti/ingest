import { arrayRemove, doc, getDoc, writeBatch } from "firebase/firestore";

import { db } from "~/shared/lib/firebase/client";
import { COLLECTION } from "~/shared/lib/firebase/collections";

export async function removeArchiveVideo(
  userId: string,
  archiveId: string,
  payload: any
) {
  const userRef = doc(db, COLLECTION.users, userId);
  const archiveRef = doc(db, COLLECTION.archives, archiveId);
  const userArchiveRef = doc(userRef, COLLECTION.archives, archiveId);

  const batch = writeBatch(db);

  try {
    const userArchiveSnap = await getDoc(userArchiveRef);
    const userArchiveData = userArchiveSnap.data();

    const currentTotalVideos = userArchiveData?.videoIds?.length || 0;
    batch.update(userArchiveRef, {
      updatedAt: new Date(),
      videoIds: arrayRemove(payload.videoId),
    });

    batch.update(archiveRef, {
      "data.totalVideos": Math.max(0, currentTotalVideos - 1),
      "data.updatedAt": new Date(),
      "data.videos": arrayRemove(payload),
    });

    batch.commit();

    return "Video removed successfully.";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to remove video from archive.";
  }
}
