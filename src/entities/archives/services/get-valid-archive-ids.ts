import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { unstable_noStore } from "next/cache";

import { db } from "~/shared/lib/firebase/client";
import { COLLECTION } from "~/shared/lib/firebase/collections";
import { ValidMetadata } from "~/shared/types-schema/types";

const getArchiveMetadata = async (archiveId: string) => {
  const archiveRef = doc(db, COLLECTION.archives, archiveId);
  const archiveSnap = await getDoc(archiveRef);
  const archiveData = archiveSnap.data();
  return archiveData;
};

const getVideoThumbnails = (archiveData: DocumentData) => {
  const videos = archiveData.data.videos;
  const thumbnails = videos.map((video: any) => video.thumbnail);
  return thumbnails;
};

export async function getValidArchiveIds() {
  unstable_noStore();
  let archiveListData: any[] = [];
  const archivesCollectionRef = collection(db, COLLECTION.archives);

  const validArchiveQuery = query(
    archivesCollectionRef,
    where("data.videos", "!=", false),
    limit(25)
  );

  const archivesDoc = await getDocs(validArchiveQuery);
  const archiveIds = archivesDoc.docs.map((archive) => archive.id);

  // Get the title and description of the page
  // Awaiting using a Promise.all is done to wait for the map to execute before returning the response
  await Promise.all(
    archiveIds.map(async (archiveId) => {
      const archiveData = await getArchiveMetadata(archiveId);
      if (archiveData) {
        const metaData: Omit<ValidMetadata, "pageviews"> = {
          description: archiveData?.description,
          id: archiveId,
          thumbnails: getVideoThumbnails(archiveData),
          title: archiveData?.title,
          totalVideos: archiveData?.data?.totalVideos,
          updatedAt: archiveData?.data.updatedAt.toDate(),
        };

        archiveListData.push(metaData);
      }
    })
  );

  return archiveListData;
}
