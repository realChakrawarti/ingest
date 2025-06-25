import { db, refs } from "~/shared/lib/firebase";
import { createNanoidToken } from "~/shared/utils/nanoid-token";

export async function createArchive(
  userId: string,
  archiveMeta: { title: string; description: string }
) {
  const nanoidToken = createNanoidToken(9);

  const archiveRef = refs.archives.doc(nanoidToken);

  // Add a doc to user -> archive collection
  const userArchiveRef = refs.userArchives(userId).doc(nanoidToken);

  const batch = db.admin.batch();

  try {
    // Create archive sub-collection
    batch.set(userArchiveRef, {
      updatedAt: new Date(),
      videoIds: [],
    });

    // Add a doc to archive collection
    batch.set(archiveRef, {
      data: {
        updatedAt: new Date(0),
      },
      description: archiveMeta.description,
      title: archiveMeta.title,
      videoRef: userArchiveRef,
    });

    await batch.commit();
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to create an archive.";
  }

  return nanoidToken;
}
