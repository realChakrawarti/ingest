import { doc, setDoc } from "firebase/firestore";

import { db } from "~/shared/lib/firebase/client";
import { COLLECTION } from "~/shared/lib/firebase/collections";
import { createNanoidToken } from "~/shared/lib/nanoid-token";

type CatalogMeta = {
  title: string;
  description: string;
};

/**
 * This function creates a catalog for a user
 * @param userId
 */
export async function createCatalog(userId: string, catalogMeta: CatalogMeta) {
  const userRef = doc(db, COLLECTION.users, userId);
  const nanoidToken = createNanoidToken(6);
  const catalogRef = doc(db, COLLECTION.catalogs, nanoidToken);

  // Add a doc to user -> catalog collection
  const userCatalogRef = doc(userRef, COLLECTION.catalogs, nanoidToken);

  // Create catalog sub-collection
  await setDoc(userCatalogRef, {
    channels: [],
    playlists: [],
    updatedAt: new Date(),
  });

  // Add a doc to catalog collection
  await setDoc(catalogRef, {
    data: {
      updatedAt: new Date(0),
    },
    description: catalogMeta.description,
    title: catalogMeta.title,
    videoRef: userCatalogRef,
  });

  return nanoidToken;
}
