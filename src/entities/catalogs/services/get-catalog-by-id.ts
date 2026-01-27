import { timestampUTC } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";
import { jsonResult } from "~/shared/utils/json-return";

import type { ZCatalogByID } from "../models";

export async function getCatalogById(catalogId: string, userId: string) {
  let catalogResponseData: ZCatalogByID = {
    description: "",
    isPublic: true,
    lastUpdatedAt: "",
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
        isPublic: catalogData?.isPublic,
        lastUpdatedAt: timestampUTC(catalogData?.lastUpdatedAt),
        list: listData,
        pageviews: catalogData?.pageviews,
        title: catalogData?.title,
      };
    }
  } catch (err) {
    if (err instanceof Error) {
      return jsonResult.error(err.message).return();
    }
    return jsonResult
      .error("Unable to retrieve catalog by identifier.")
      .return();
  }

  return jsonResult.success(catalogResponseData).return();
}
