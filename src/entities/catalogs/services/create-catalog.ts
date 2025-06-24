import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";
import { createNanoidToken } from "~/shared/utils/nanoid-token";

type CatalogMeta = {
  title: string;
  description: string;
};

/**
 * This function creates a catalog for a user
 * @param userId
 */
export async function createCatalog(userId: string, catalogMeta: CatalogMeta) {
  const userRef = adminDb.collection(COLLECTION.users).doc(userId);
  const nanoidToken = createNanoidToken(6);
  const catalogRef = adminDb.collection(COLLECTION.catalogs).doc(nanoidToken);

  // Add a doc to user -> catalog collection
  const userCatalogRef = userRef
    .collection(COLLECTION.catalogs)
    .doc(nanoidToken);

  const batch = adminDb.batch();

  try {
    // Create catalog sub-collection
    batch.set(userCatalogRef, {
      channels: [],
      playlists: [],
      updatedAt: new Date(),
    });

    // Add a doc to catalog collection
    batch.set(catalogRef, {
      data: {
        updatedAt: new Date(0),
      },
      description: catalogMeta.description,
      title: catalogMeta.title,
      videoRef: userCatalogRef,
    });

    await batch.commit();

    return nanoidToken;
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to create the catalog.";
  }
}
