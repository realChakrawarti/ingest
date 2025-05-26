import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

export async function updateArchiveMeta(archiveId: string, archiveMeta: any) {
  const archiveRef = adminDb.collection(COLLECTION.archives).doc(archiveId);

  try {
    await archiveRef.update({
      title: archiveMeta.title,
      description: archiveMeta.description,
    });

    return "Archive details updated successfully.";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to update archive details.";
  }
}
