import { refs } from "~/shared/lib/firebase";

import type { CatalogByIdResponse, CatalogList } from "../models";

/**
 * Retrieves detailed information for a specific catalog by its ID.
 *
 * @param catalogId - The unique identifier of the catalog to retrieve
 * @param userId - The ID of the user who owns the catalog
 * @returns An object containing catalog metadata including title, description, channels, and playlists
 *
 * @remarks
 * This function fetches catalog details from two Firestore collections:
 * 1. User-specific catalog document in the user's subcollection
 * 2. Global catalog document in the catalogs collection
 *
 * @throws {Error} Logs any errors encountered during Firestore document retrieval
 */
export async function getCatalogById(catalogId: string, userId: string) {
  // Get channel list

  let catalogResponseData: CatalogByIdResponse = {
    description: "",
    list: [],
    title: "",
  };

  const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);
  const catalogRef = refs.catalogs.doc(catalogId);

  try {
    const userCatalogData = await userCatalogRef.get();
    const listData: CatalogList[] = userCatalogData.data()?.list;

    // Get title and description
    const catalogSnap = await catalogRef.get();
    const catalogData = catalogSnap.data();

    catalogResponseData = {
      description: catalogData?.description,
      list: listData,
      title: catalogData?.title,
    };
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to retrieve catalog by id.";
  }

  return catalogResponseData;
}
