import { DocumentData } from "firebase-admin/firestore";
import { unstable_noStore } from "next/cache";

import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";
import { ValidMetadata } from "~/shared/types-schema/types";

export async function getValidCatalogIds() {
  unstable_noStore();
  const catalogListData: ValidMetadata[] = [];
  const catalogsCollectionRef = adminDb.collection(COLLECTION.catalogs);

  // Filter the catalog, where totalVideos is greater than 0 and pageviews are sorted 'desc'
  const validCatalogQuery = catalogsCollectionRef
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
        const metaData: ValidMetadata = {
          description: catalogData?.description,
          id: catalogId,
          pageviews: catalogData.pageviews ?? 0,
          thumbnails: getVideoThumbnails(catalogData),
          title: catalogData?.title,
          totalVideos: catalogData?.data?.totalVideos,
          updatedAt: catalogData?.data.updatedAt.toDate(),
        };

        catalogListData.push(metaData);
      }
    })
  );

  return catalogListData;
}

const getCatalogMetadata = async (catalogId: string) => {
  const catalogRef = adminDb.collection(COLLECTION.catalogs).doc(catalogId);
  const catalogSnap = await catalogRef.get();
  const catalogData = catalogSnap.data();
  return catalogData;
};

type CatalogDocumentData = {
  channelId: string;
  channelLogo: string;
  channelTitle: string;
  description: string;
  publishedAt: string;
  thumbnail: {
    height: number;
    width: number;
    url: string;
  };
  title: string;
  videoId: string;
};

const getVideoThumbnails = (catalogData: DocumentData) => {
  const videos = catalogData.data.videos;
  const dayThumbnails = videos.day.map(
    (video: CatalogDocumentData) => video.thumbnail.url
  );
  const weekThumbnails = videos.week.map(
    (video: CatalogDocumentData) => video.thumbnail.url
  );
  const monthThumbnails = videos.month.map(
    (video: CatalogDocumentData) => video.thumbnail.url
  );
  return [...dayThumbnails, ...weekThumbnails, ...monthThumbnails];
};
