import { FieldValue } from "firebase-admin/firestore";

import { admin } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";

export async function removeArchiveVideo(
  userId: string,
  archiveId: string,
  payload: any
) {
  const archiveRef = refs.archives.doc(archiveId);
  const userArchiveRef = refs.userArchives(userId).doc(archiveId);

  const batch = admin.db.batch();

  try {
    const userArchiveSnap = await userArchiveRef.get();
    const userArchiveData = userArchiveSnap.data();

    const currentTotalVideos = userArchiveData?.videoIds?.length || 0;
    batch.update(userArchiveRef, {
      updatedAt: new Date(),
      videoIds: FieldValue.arrayRemove(payload.videoId),
    });

    batch.update(archiveRef, {
      "data.totalVideos": Math.max(0, currentTotalVideos - 1),
      "data.updatedAt": new Date(),
      "data.videos": FieldValue.arrayRemove(payload),
    });

    await batch.commit();

    return "Video removed successfully.";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to remove video from archive.";
  }
}
