import type { ZPickValid } from "../models";
import type { DocumentData } from "firebase-admin/firestore";

import { unstable_noStore } from "next/cache";

import type { ZYouTubeVideoMetadata } from "~/entities/youtube/models";

import { refs } from "~/shared/lib/firebase/refs";

const getPickMetadata = async (pickId: string) => {
  const pickRef = refs.picks.doc(pickId);
  const pickSnap = await pickRef.get();
  const pickData = pickSnap.data();
  return pickData;
};

const getVideoThumbnails = (pickData: DocumentData) => {
  const videos: ZYouTubeVideoMetadata[] = pickData.videos;
  const thumbnails = videos.map((video) => video.videoThumbnail);
  return thumbnails;
};

export async function getValidPickIds() {
  unstable_noStore();
  const pickListData: ZPickValid[] = [];

  const validPickQuery = refs.picks
    .where("data.videos", "!=", false)
    .where("isPublic", "==", true)
    .limit(25);
  const validPickQuerySnapshot = await validPickQuery.get();

  if (validPickQuerySnapshot.empty) {
    return pickListData;
  }

  const pickIds = validPickQuerySnapshot.docs.map((pick) => pick.id);

  // Get the title and description of the page
  // Awaiting using a Promise.all is done to wait for the map to execute before returning the response
  await Promise.all(
    pickIds.map(async (pickId) => {
      const pickData = await getPickMetadata(pickId);
      if (pickData && pickData.isPublic !== false) {
        const metaData: ZPickValid = {
          description: pickData?.description,
          id: pickId,
          isPublic: pickData?.isPublic ?? true,
          thumbnails: getVideoThumbnails(pickData.data),
          title: pickData?.title,
          totalVideos: pickData?.data.totalVideos,
          updatedAt: pickData?.data.updatedAt,
        };

        pickListData.push(metaData);
      }
    })
  );

  return pickListData;
}