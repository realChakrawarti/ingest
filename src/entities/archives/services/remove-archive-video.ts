import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

export async function removeArchiveVideo(
  userId: string,
  archiveId: string,
  payload: any
) {
  const userRef = adminDb.collection(COLLECTION.users).doc(userId);
  const archiveRef = adminDb.collection(COLLECTION.archives).doc(archiveId);
  const userArchiveRef = userRef.collection(COLLECTION.archives).doc(archiveId);

  const batch = adminDb.batch();

  try {
    const userArchiveSnap = await userArchiveRef.get();
    const userArchiveData = userArchiveSnap.data();

    const currentTotalVideos = userArchiveData?.videoIds?.length || 0;
    batch.update(userArchiveRef, {
      updatedAt: new Date(),
      videoIds: FieldValue.arrayRemove(payload.videoId),
    });

    batch.update(archiveRef, {
      "data.totalVideos": Math.max(0, currentTotalVideos - 1),
      "data.updatedAt": new Date(),
      "data.videos": FieldValue.arrayRemove(payload),
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
