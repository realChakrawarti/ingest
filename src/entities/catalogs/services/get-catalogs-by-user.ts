import { toUTCString } from "~/shared/lib/date-time/to-utc-string";
import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

/**
 * This function returns all catalogs of a user
 * @param userId
 * @returns
 */
export async function getCatalogByUser(userId: string) {
  let userCatalogsData: any[] = [];

  const userRef = adminDb.collection(COLLECTION.users).doc(userId);
  try {
    const userCatalogsCollectionRef = userRef.collection(COLLECTION.catalogs);
    const userCatalogsDoc = await userCatalogsCollectionRef.get();

    if (userCatalogsDoc.empty) {
      return userCatalogsData;
    }

    const catalogIds = userCatalogsDoc.docs.map((doc) => doc.id);

    for (let i = 0; i < catalogIds.length; i++) {
      const catalogId = catalogIds[i];
      const catalogRef = adminDb.collection(COLLECTION.catalogs).doc(catalogId);
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
    }
  } catch (err) {
    console.error(err);
  }

  return userCatalogsData;
}
