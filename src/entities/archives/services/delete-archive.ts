import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

export async function deleteArchive(userId: string, archiveId: string) {
  const archiveRef = adminDb.collection(COLLECTION.archives).doc(archiveId);

  const userArchiveRef = adminDb
    .collection(COLLECTION.users)
    .doc(userId)
    .collection(COLLECTION.archives)
    .doc(archiveId);

  const batch = adminDb.batch();

  try {
    batch.delete(archiveRef);
    batch.delete(userArchiveRef);
    await batch.commit();
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to delete the archive.";
  }
}
