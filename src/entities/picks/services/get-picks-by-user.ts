import type { ZPickByUser } from "../models";

import { timestampUTC } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";
import Log from "~/shared/utils/terminal-logger";

/**
 * This function returns all pick of a user
 * @param userId
 * @returns
 */
export async function getPickByUser(userId: string) {
  const userPicksCollectionRef = refs.userPicks(userId);
  try {
    const userPicksDoc = await userPicksCollectionRef.listDocuments();
    const pickIds = userPicksDoc.map((doc) => doc.id);

    if (!pickIds.length) {
      return [];
    }

    const pickRefs = pickIds.map((id) => refs.picks.doc(id));

    const pickSnapshots = await Promise.all(pickRefs.map((ref) => ref.get()));

    const userPicksData: ZPickByUser[] = pickSnapshots.map(
      (snapshot, index) => {
        const pickData = snapshot.data();
        const pickId = pickIds[index];

        if (pickData) {
          return {
            description: pickData?.description,
            id: pickId,
            isPublic: pickData?.isPublic,
            title: pickData?.title,
            updatedAt: timestampUTC(pickData.data.updatedAt),
          };
        }
        throw Error("Pick data is not available.");
      }
    );

    return userPicksData;
  } catch (err) {
    Log.fail(err);
    throw err;
  }
}