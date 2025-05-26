import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

export async function addArchiveVideo(
  userId: string,
  archiveId: string,
  videoData: any
) {
  const userRef = adminDb.collection(COLLECTION.users).doc(userId);
  const archiveRef = adminDb.collection(COLLECTION.archives).doc(archiveId);
  const userArchiveRef = userRef.collection(COLLECTION.archives).doc(archiveId);

  try {
    await adminDb.runTransaction(async (t) => {
      const userArchiveSnap = await t.get(userArchiveRef);
      const userArchiveData = userArchiveSnap.data();

      const currentTotalVideos = userArchiveData?.videoIds?.length || 0;

      t.update(userArchiveRef, {
        updatedAt: new Date(),
        videoIds: FieldValue.arrayUnion(videoData.videoId),
      });

      t.update(archiveRef, {
        "data.totalVideos": currentTotalVideos + 1,
        "data.updatedAt": new Date(),
        "data.videos": FieldValue.arrayUnion(videoData),
      });
    });

    return "Video added successfully to the archive.";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to add video to the archive.";
  }
}
