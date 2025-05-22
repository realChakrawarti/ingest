import { FieldValue } from "firebase-admin/firestore";

import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

export async function addArchiveVideo(
  userId: string,
  archiveId: string,
  videoData: any
) {
  const userRef = adminDb.collection(COLLECTION.catalogs).doc(userId);
  const archiveRef = adminDb.collection(COLLECTION.archives).doc(archiveId);
  const userArchiveRef = userRef.collection(COLLECTION.archives).doc(archiveId);

  const batch = adminDb.batch();

  // Since both read and writes happening, consider using `runTransaction`
  // Refer: https://firebase.google.com/docs/firestore/manage-data/transactions
  try {
    const userArchiveSnap = await userArchiveRef.get();
    const userArchiveData = userArchiveSnap.data();

    const currentTotalVideos = userArchiveData?.videoIds?.length || 0;
    batch.update(archiveRef, {
      "data.totalVideos": currentTotalVideos + 1,
      "data.updatedAt": new Date(),
      "data.videos": FieldValue.arrayUnion(videoData),
    });

    batch.update(userArchiveRef, {
      updatedAt: new Date(),
      videoIds: FieldValue.arrayUnion(videoData.videoId),
    });

    batch.commit();

    return "Video added successfully.";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to add video to archive.";
  }
}
