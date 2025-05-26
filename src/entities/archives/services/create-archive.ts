import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";
import { createNanoidToken } from "~/shared/lib/nanoid-token";

export async function createArchive(userId: string, archiveMeta: any) {
  const nanoidToken = createNanoidToken(9);

  const userRef = adminDb.collection(COLLECTION.users).doc(userId);
  const archiveRef = adminDb.collection(COLLECTION.archives).doc(nanoidToken);

  // Add a doc to user -> archive collection
  const userArchiveRef = userRef
    .collection(COLLECTION.archives)
    .doc(nanoidToken);

  const batch = adminDb.batch();

  try {
    // Create archive sub-collection
    batch.set(userArchiveRef, {
      videoIds: [],
      updatedAt: new Date(),
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
