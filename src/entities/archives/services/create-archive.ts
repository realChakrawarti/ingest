import { doc, setDoc } from "firebase/firestore";

import { db } from "~/shared/lib/firebase/client";
import { COLLECTION } from "~/shared/lib/firebase/collections";
import { createNanoidToken } from "~/shared/lib/nanoid-token";

export async function createArchive(userId: string, archiveMeta: any) {
  const nanoidToken = createNanoidToken(9);

  const userRef = doc(db, COLLECTION.users, userId);
  const archiveRef = doc(db, COLLECTION.archives, nanoidToken);

  // Add a doc to user -> archive collection
  const userArchiveRef = doc(userRef, COLLECTION.archives, nanoidToken);

  // Create archive sub-collection
  await setDoc(userArchiveRef, {
    videoIds: [],
    updatedAt: new Date(),
  });

  // Add a doc to archive collection
  await setDoc(archiveRef, {
    data: {
      updatedAt: new Date(0),
    },
    description: archiveMeta.description,
    title: archiveMeta.title,
    videoRef: userArchiveRef,
  });

  return nanoidToken;
}
