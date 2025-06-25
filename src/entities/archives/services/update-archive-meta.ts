import { refs } from "~/shared/lib/firebase";

export async function updateArchiveMeta(
  archiveId: string,
  archiveMeta: { title: string; description: string }
) {
  const archiveRef = refs.archives.doc(archiveId);

  try {
    await archiveRef.update({
      description: archiveMeta.description,
      title: archiveMeta.title,
    });

    return "Archive details updated successfully.";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to update archive details.";
  }
}
