import { doc, getDoc } from "firebase/firestore";

import { db } from "~/shared/lib/firebase/client";
import { COLLECTION } from "~/shared/lib/firebase/collections";
import {
  CatalogByIdResponse,
  CatalogChannel,
  CatalogPlaylist,
} from "~/shared/types-schema/types";

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
  const userRef = doc(db, COLLECTION.users, userId);

  let catalogResponseData: CatalogByIdResponse = {
    channelList: [],
    description: "",
    playlist: [],
    title: "",
  };

  try {
    const userCatalogRef = doc(userRef, COLLECTION.catalogs, catalogId);

    const userCatalogData = await getDoc(userCatalogRef);
    const channelListData: CatalogChannel[] = userCatalogData.data()?.channels;
    const playlistData: CatalogPlaylist[] = userCatalogData.data()?.playlists;

    // Get title and description

    const catalogRef = doc(db, COLLECTION.catalogs, catalogId);
    const catalogSnap = await getDoc(catalogRef);
    const catalogData = catalogSnap.data();

    catalogResponseData = {
      channelList: channelListData,
      description: catalogData?.description,
      playlist: playlistData,
      title: catalogData?.title,
    };
  } catch (err) {
    console.error(err);
  }

  return catalogResponseData;
}
