import { Timestamp } from "firebase-admin/firestore";

import { admin } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";
import { createNanoidToken } from "~/shared/utils/nanoid-token";

import type { ZArchiveMeta } from "../models";

export async function createArchive(
  userId: string,
  archiveMeta: Omit<ZArchiveMeta, "lastUpdatedAt">
) {
  const nanoidToken = createNanoidToken(9);

  const archiveRef = refs.archives.doc(nanoidToken);

  // Add a doc to user -> archive collection
  const userArchiveRef = refs.userArchives(userId).doc(nanoidToken);

  const batch = admin.db.batch();

  try {
    // Create archive sub-collection
    batch.set(userArchiveRef, {
      updatedAt: Timestamp.fromDate(new Date()),
      videoIds: [],
    });

    // Add a doc to archive collection
    batch.set(archiveRef, {
      data: {
        totalVideos: 0,
        updatedAt: Timestamp.fromDate(new Date(0)),
      },
      description: archiveMeta.description,
      isPublic: archiveMeta.isPublic,
      lastUpdatedAt: Timestamp.now(),
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
