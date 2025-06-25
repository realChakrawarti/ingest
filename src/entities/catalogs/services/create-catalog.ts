import { db, refs } from "~/shared/lib/firebase";
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
  const nanoidToken = createNanoidToken(6);
  const catalogRef = refs.catalogs.doc(nanoidToken);

  // Add a doc to user -> catalog collection
  const userCatalogRef = refs.userCatalogs(userId).doc(nanoidToken);

  const batch = db.admin.batch();

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
