import { db, refs } from "~/shared/lib/firebase";

export async function deleteArchive(userId: string, archiveId: string) {
  const archiveRef = refs.archives.doc(archiveId);

  const userArchiveRef = refs.userArchives(userId).doc(archiveId);

  const batch = db.admin.batch();

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
