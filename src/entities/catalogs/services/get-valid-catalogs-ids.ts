import { unstable_noStore } from "next/cache";

import { refs } from "~/shared/lib/firebase/refs";

import type { ZCatalogDocument, ZCatalogValid } from "../models";

export async function getValidCatalogIds() {
  unstable_noStore();
  const catalogListData: ZCatalogValid[] = [];

  // Filter the catalog, where totalVideos is greater than 0, isPublic is true, and pageviews are sorted 'desc'
  const validCatalogQuery = refs.catalogs
    .where("data.totalVideos", ">", 0)
    .where("isPublic", "==", true)
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
      if (catalogData && catalogData.isPublic !== false) {
        const metaData = {
          description: catalogData?.description,
          id: catalogId,
          isPublic: catalogData?.isPublic ?? true,
          pageviews: catalogData.pageviews ?? 0,
          thumbnails: getVideoThumbnails(catalogData),
          title: catalogData?.title,
          totalPosts: catalogData?.data.totalPosts,
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
  const dayThumbnails = videos?.day.map((video) => video.videoThumbnail) ?? [];
  const weekThumbnails =
    videos?.week.map((video) => video.videoThumbnail) ?? [];
  const monthThumbnails =
    videos?.month.map((video) => video.videoThumbnail) ?? [];
  return [...dayThumbnails, ...weekThumbnails, ...monthThumbnails];
};
