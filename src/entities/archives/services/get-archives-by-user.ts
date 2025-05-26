import { toUTCString } from "~/shared/lib/date-time/to-utc-string";
import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

/**
 * This function returns all archive of a user
 * @param userId
 * @returns
 */
export async function getArchiveByUser(userId: string) {
  let userArchivesData: any[] = [];

  const userRef = adminDb.collection(COLLECTION.users).doc(userId);
  try {
    const userArchivesCollectionRef = userRef.collection(COLLECTION.archives);
    const userArchivesDoc = await userArchivesCollectionRef.listDocuments();
    const archiveIds = userArchivesDoc.map((doc) => doc.id);

    if (!archiveIds.length) {
      return userArchivesData;
    }

    const archiveRefs = archiveIds.map((id) =>
      adminDb.collection(COLLECTION.archives).doc(id)
    );

    const archiveSnapshots = await Promise.all(
      archiveRefs.map((ref) => ref.get())
    );

    userArchivesData = archiveSnapshots.map((snapshot, index) => {
      const archiveData = snapshot.data();
      const archiveId = archiveIds[index];

      return {
        description: archiveData?.description,
        id: archiveId,
        title: archiveData?.title,
        videoData: {
          updatedAt: toUTCString(archiveData?.data?.updatedAt),
          videos: archiveData?.data?.videos,
        },
      };
    });
  } catch (err) {
    console.error(err);
  }

  return userArchivesData;
}
