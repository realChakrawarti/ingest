import { timestampUTC } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";
import Log from "~/shared/utils/terminal-logger";

import type { ZArchiveByUser } from "../models";

/**
 * This function returns all archive of a user
 * @param userId
 * @returns
 */
export async function getArchiveByUser(userId: string) {
  const userArchivesCollectionRef = refs.userArchives(userId);
  try {
    const userArchivesDoc = await userArchivesCollectionRef.listDocuments();
    const archiveIds = userArchivesDoc.map((doc) => doc.id);

    if (!archiveIds.length) {
      return [];
    }

    const archiveRefs = archiveIds.map((id) => refs.archives.doc(id));

    const archiveSnapshots = await Promise.all(
      archiveRefs.map((ref) => ref.get())
    );

    const userArchivesData: ZArchiveByUser[] = archiveSnapshots.map(
      (snapshot, index) => {
        const archiveData = snapshot.data();
        const archiveId = archiveIds[index];

        if (archiveData) {
          return {
            description: archiveData?.description,
            id: archiveId,
            isPublic: archiveData?.isPublic,
            title: archiveData?.title,
            updatedAt: timestampUTC(archiveData.data.updatedAt),
          };
        }
        throw Error("Archive data is not available.");
      }
    );

    return userArchivesData;
  } catch (err) {
    Log.fail(err);
    throw err;
  }
}
