import { arrayUnion, doc, getDoc, writeBatch } from "firebase/firestore";

import { db } from "~/shared/lib/firebase/client";
import { COLLECTION } from "~/shared/lib/firebase/collections";

export async function addArchiveVideo(
  userId: string,
  archiveId: string,
  videoData: any
) {
  const userRef = doc(db, COLLECTION.users, userId);
  const archiveRef = doc(db, COLLECTION.archives, archiveId);
  const userArchiveRef = doc(userRef, COLLECTION.archives, archiveId);

  const batch = writeBatch(db);

  // Since both read and writes happening, consider using `runTransaction`
  // Refer: https://firebase.google.com/docs/firestore/manage-data/transactions
  try {
    const userArchiveSnap = await getDoc(userArchiveRef);
    const userArchiveData = userArchiveSnap.data();

    const currentTotalVideos = userArchiveData?.videoIds?.length || 0;
    batch.update(archiveRef, {
      "data.totalVideos": currentTotalVideos + 1,
      "data.updatedAt": new Date(),
      "data.videos": arrayUnion(videoData),
    });

    batch.update(userArchiveRef, {
      updatedAt: new Date(),
      videoIds: arrayUnion(videoData.videoId),
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
