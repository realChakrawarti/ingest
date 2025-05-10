import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { toUTCString } from "~/shared/lib/date-time/to-utc-string";
import { db } from "~/shared/lib/firebase/client";
import { COLLECTION } from "~/shared/lib/firebase/collections";

/**
 * This function returns all archive of a user
 * @param userId
 * @returns
 */
export async function getArchiveByUser(userId: string) {
  let userArchivesData: any[] = [];

  const userRef = doc(db, COLLECTION.users, userId);
  try {
    const userArchivesCollectionRef = collection(userRef, COLLECTION.archives);
    const userArchivesDoc = await getDocs(userArchivesCollectionRef);
    const archiveIds = userArchivesDoc.docs.map((doc) => doc.id);

    if (!archiveIds.length) {
      return userArchivesData;
    }

    for (let i = 0; i < archiveIds.length; i++) {
      const archiveId = archiveIds[i];
      const archiveRef = doc(db, COLLECTION.archives, archiveId);
      const archiveSnap = await getDoc(archiveRef);
      const archiveData = archiveSnap.data();

      userArchivesData.push({
        description: archiveData?.description,
        id: archiveId,
        title: archiveData?.title,
        videoData: {
          updatedAt: toUTCString(archiveData?.data?.updatedAt),
          videos: archiveData?.data?.videos,
        },
      });
    }
  } catch (err) {
    console.error(err);
  }

  return userArchivesData;
}
