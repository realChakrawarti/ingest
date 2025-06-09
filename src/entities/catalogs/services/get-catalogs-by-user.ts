import { toUTCString } from "~/shared/lib/date-time/to-utc-string";
import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";
import TerminalLogger from "~/shared/lib/terminal-logger";

type UserCatalogs = {
  description: string;
  id: string;
  title: string;
  videoData: {
    updatedAt: string;
    videos: any;
  };
};

/**
 * This function returns all catalogs of a user
 * @param userId
 * @returns
 */
export async function getCatalogByUser(userId: string) {
  const userCatalogsData: UserCatalogs[] = [];

  const userRef = adminDb.collection(COLLECTION.users).doc(userId);
  const userCatalogsCollectionRef = userRef.collection(COLLECTION.catalogs);
  try {
    const userCatalogsDoc = await userCatalogsCollectionRef.get();

    if (userCatalogsDoc.empty) {
      return userCatalogsData;
    }

    const catalogIds = userCatalogsDoc.docs.map((doc) => doc.id);

    await Promise.all(
      catalogIds.map(async (catalogId) => {
        const catalogRef = adminDb
          .collection(COLLECTION.catalogs)
          .doc(catalogId);
        const catalogSnap = await catalogRef.get();
        const catalogData = catalogSnap.data();

        userCatalogsData.push({
          description: catalogData?.description,
          id: catalogId,
          title: catalogData?.title,
          videoData: {
            updatedAt: toUTCString(catalogData?.data?.updatedAt),
            videos: catalogData?.data?.videos,
          },
        });
      })
    );
  } catch (err) {
    TerminalLogger.fail(String(err));
  }

  return userCatalogsData;
}
