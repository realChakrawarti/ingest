import { timestampUTC } from "~/shared/lib/firebase";
import { refs } from "~/shared/lib/firebase/refs";
import Log from "~/shared/utils/terminal-logger";

/**
 * This function returns all archive of a user
 * @param userId
 * @returns
 */
export async function getArchiveByUser(userId: string) {
  let userArchivesData: any[] = [];

  try {
    const userArchivesCollectionRef = refs.userArchives(userId);
    const userArchivesDoc = await userArchivesCollectionRef.listDocuments();
    const archiveIds = userArchivesDoc.map((doc) => doc.id);

    if (!archiveIds.length) {
      return userArchivesData;
    }

    const archiveRefs = archiveIds.map((id) => refs.archives.doc(id));

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
          updatedAt: timestampUTC(archiveData?.data?.updatedAt),
          videos: archiveData?.data?.videos,
        },
      };
    });
  } catch (err) {
    Log.fail(err);
  }

  return userArchivesData;
}
