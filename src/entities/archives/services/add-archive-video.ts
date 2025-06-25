import { FieldValue } from "firebase-admin/firestore";

import type { VideoDetails } from "~/entities/youtube/models";

import { db, refs } from "~/shared/lib/firebase";

export async function addArchiveVideo(
  userId: string,
  archiveId: string,
  videoData: VideoDetails
) {
  const archiveRef = refs.archives.doc(archiveId);
  const userArchiveRef = refs.userArchives(userId).doc(archiveId);

  try {
    await db.admin.runTransaction(async (txn) => {
      const userArchiveSnap = await txn.get(userArchiveRef);
      const userArchiveData = userArchiveSnap.data();

      const currentTotalVideos = userArchiveData?.videoIds?.length || 0;

      txn.update(userArchiveRef, {
        updatedAt: new Date(),
        videoIds: FieldValue.arrayUnion(videoData.videoId),
      });

      txn.update(archiveRef, {
        "data.totalVideos": currentTotalVideos + 1,
        "data.updatedAt": new Date(),
        "data.videos": FieldValue.arrayUnion(videoData),
      });
    });

    return "Video added successfully to the archive.";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to add video to the archive.";
  }
}
