import { admin } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";

export async function deleteArchive(userId: string, archiveId: string) {
  const archiveRef = refs.archives.doc(archiveId);

  const userArchiveRef = refs.userArchives(userId).doc(archiveId);

  const batch = admin.db.batch();

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
