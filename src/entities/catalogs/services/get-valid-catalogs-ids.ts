import { unstable_noStore } from "next/cache";

import { refs } from "~/shared/lib/firebase/refs";

import type { ZCatalogDocument, ZCatalogValid } from "../models";

export async function getValidCatalogIds() {
  unstable_noStore();
  const catalogListData: ZCatalogValid[] = [];

  // Filter the catalog, where totalVideos is greater than 0 and pageviews are sorted 'desc'
  const validCatalogQuery = refs.catalogs
    .where("data.totalVideos", ">", 0)
    .orderBy("pageviews", "desc")
    .limit(50);

  const querySnapshot = await validCatalogQuery.get();
  if (querySnapshot.empty) {
    return catalogListData;
  }

  const catalogIds = querySnapshot.docs.map((catalog) => catalog.id);

  // Get the title and description of the page
  // Awaiting using a Promise.all is done to wait for the map to execute before returning the response
  await Promise.all(
    catalogIds.map(async (catalogId) => {
      const catalogData = await getCatalogMetadata(catalogId);
      if (catalogData) {
        const metaData = {
          description: catalogData?.description,
          id: catalogId,
          pageviews: catalogData.pageviews ?? 0,
          thumbnails: getVideoThumbnails(catalogData),
          title: catalogData?.title,
          totalVideos: catalogData?.data?.totalVideos,
          updatedAt: catalogData?.data.updatedAt,
        };

        catalogListData.push(metaData);
      }
    })
  );

  return catalogListData;
}

const getCatalogMetadata = async (catalogId: string) => {
  const catalogRef = refs.catalogs.doc(catalogId);
  const catalogSnap = await catalogRef.get();
  const catalogData = catalogSnap.data();
  return catalogData;
};

const getVideoThumbnails = (catalogData: ZCatalogDocument) => {
  const videos = catalogData.data.videos;
  const dayThumbnails = videos.day.map((video) => video.thumbnail);
  const weekThumbnails = videos.week.map((video) => video.thumbnail);
  const monthThumbnails = videos.month.map((video) => video.thumbnail);
  return [...dayThumbnails, ...weekThumbnails, ...monthThumbnails];
};
