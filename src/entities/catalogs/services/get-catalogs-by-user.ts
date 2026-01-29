import { timestampUTC } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";
import Log from "~/shared/utils/terminal-logger";

import type { ZCatalogByUser } from "../models";

export async function getCatalogByUser(userId: string) {
  const userCatalogsData: ZCatalogByUser[] = [];

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

        if (catalogData) {
          userCatalogsData.push({
            description: catalogData.description,
            id: catalogId,
            isPublic: catalogData?.isPublic,
            title: catalogData?.title,
            updatedAt: timestampUTC(catalogData?.data?.updatedAt),
          });
        }
      })
    );
  } catch (err) {
    Log.fail(err);
  }

  return userCatalogsData;
}
