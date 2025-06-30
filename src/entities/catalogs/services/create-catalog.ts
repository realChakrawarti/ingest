import { admin } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";
import { createNanoidToken } from "~/shared/utils/nanoid-token";

import type { ZCatalogMeta } from "../models";

export async function createCatalog(userId: string, meta: ZCatalogMeta) {
  const nanoidToken = createNanoidToken(6);
  const catalogRef = refs.catalogs.doc(nanoidToken);

  // Add a doc to user -> catalog collection
  const userCatalogRef = refs.userCatalogs(userId).doc(nanoidToken);

  const batch = admin.db.batch();

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
      description: meta.description,
      title: meta.title,
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
