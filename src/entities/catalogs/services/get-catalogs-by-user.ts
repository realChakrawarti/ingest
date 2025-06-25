import { timestampUTC } from "~/shared/lib/firebase";
import { refs } from "~/shared/lib/firebase/refs";
import Log from "~/shared/utils/terminal-logger";

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

  const userCatalogsCollectionRef = refs.userCatalogs(userId);
  try {
    const userCatalogsDoc = await userCatalogsCollectionRef.get();

    if (userCatalogsDoc.empty) {
      return userCatalogsData;
    }

    const catalogIds = userCatalogsDoc.docs.map((doc) => doc.id);

    await Promise.all(
      catalogIds.map(async (catalogId) => {
        const catalogRef = refs.catalogs.doc(catalogId);
        const catalogSnap = await catalogRef.get();
        const catalogData = catalogSnap.data();

        userCatalogsData.push({
          description: catalogData?.description,
          id: catalogId,
          title: catalogData?.title,
          videoData: {
            updatedAt: timestampUTC(catalogData?.data?.updatedAt),
            videos: catalogData?.data?.videos,
          },
        });
      })
    );
  } catch (err) {
    Log.fail(err);
  }

  return userCatalogsData;
}
