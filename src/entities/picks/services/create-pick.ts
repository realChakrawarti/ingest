import type { ZPickMeta } from "../models";

import { Timestamp } from "firebase-admin/firestore";

import { admin } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";
import { createNanoidToken } from "~/shared/utils/nanoid-token";

export async function createPick(
  userId: string,
  pickMeta: Omit<ZPickMeta, "lastUpdatedAt">
) {
  const nanoidToken = createNanoidToken(9);

  const pickRef = refs.picks.doc(nanoidToken);

  // Add a doc to user -> pick collection
  const userPickRef = refs.userPicks(userId).doc(nanoidToken);

  const batch = admin.db.batch();

  try {
    // Create pick sub-collection
    batch.set(userPickRef, {
      updatedAt: Timestamp.fromDate(new Date()),
      videoIds: [],
    });

    // Add a doc to pick collection
    batch.set(pickRef, {
      data: {
        totalVideos: 0,
        updatedAt: Timestamp.fromDate(new Date(0)),
      },
      description: pickMeta.description,
      isPublic: pickMeta.isPublic,
      lastUpdatedAt: Timestamp.now(),
      title: pickMeta.title,
      videoRef: userPickRef,
    });

    await batch.commit();
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to create an pick.";
  }

  return nanoidToken;
}