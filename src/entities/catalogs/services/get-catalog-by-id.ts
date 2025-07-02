import { refs } from "~/shared/lib/firebase/refs";

import type { ZCatalogByID } from "../models";

export async function getCatalogById(catalogId: string, userId: string) {
  let catalogResponseData: ZCatalogByID = {
    description: "",
    list: [],
    title: "",
  };

  const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);
  const catalogRef = refs.catalogs.doc(catalogId);

  try {
    const userCatalogData = await userCatalogRef.get();
    const listData = userCatalogData.data()?.list;

    // Get title and description
    const catalogSnap = await catalogRef.get();
    const catalogData = catalogSnap.data();

    if (catalogData && listData) {
      catalogResponseData = {
        description: catalogData?.description,
        list: listData,
        title: catalogData?.title,
      };
    }
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to retrieve catalog by id.";
  }

  return catalogResponseData;
}
