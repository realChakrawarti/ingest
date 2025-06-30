import type { DocumentData } from "firebase-admin/firestore";
import { unstable_noStore } from "next/cache";

import type { ZYouTubeVideoMetadata } from "~/entities/youtube/models";

import { refs } from "~/shared/lib/firebase/refs";

import type { ZArchiveValid } from "../models";

const getArchiveMetadata = async (archiveId: string) => {
  const archiveRef = refs.archives.doc(archiveId);
  const archiveSnap = await archiveRef.get();
  const archiveData = archiveSnap.data();
  return archiveData;
};

const getVideoThumbnails = (archiveData: DocumentData) => {
  const videos: ZYouTubeVideoMetadata[] = archiveData.videos;
  const thumbnails = videos.map((video) => video.videoThumbnail);
  return thumbnails;
};

export async function getValidArchiveIds() {
  unstable_noStore();
  const archiveListData: any[] = [];

  const validArchiveQuery = refs.archives
    .where("data.videos", "!=", false)
    .limit(25);
  const validArchiveQuerySnapshot = await validArchiveQuery.get();

  if (validArchiveQuerySnapshot.empty) {
    return archiveListData;
  }

  const archiveIds = validArchiveQuerySnapshot.docs.map(
    (archive) => archive.id
  );

  // Get the title and description of the page
  // Awaiting using a Promise.all is done to wait for the map to execute before returning the response
  await Promise.all(
    archiveIds.map(async (archiveId) => {
      const archiveData = await getArchiveMetadata(archiveId);
      if (archiveData) {
        const metaData: ZArchiveValid = {
          description: archiveData?.description,
          id: archiveId,
          thumbnails: getVideoThumbnails(archiveData.data),
          title: archiveData?.title,
          totalVideos: archiveData?.data.totalVideos,
          updatedAt: archiveData?.data.updatedAt,
        };

        archiveListData.push(metaData);
      }
    })
  );

  return archiveListData;
}
