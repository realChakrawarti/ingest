import { doc, getDoc } from "firebase/firestore";

import { db } from "~/shared/lib/firebase/client";
import { COLLECTION } from "~/shared/lib/firebase/collections";

/**
 * This function sends the response of a specific catalog provided a valid catalogId
 * @param archiveId
 * @param userId
 * @returns
 */

// TODO: How would I handle the data? VideoId as an array in userArchive and data
// retrived from API stored as an object in the main archive?
export async function getArchiveById(archiveId: string) {
  let archiveResponseData = {};

  try {
    // Get title and description
    const archiveRef = doc(db, COLLECTION.archives, archiveId);
    const archiveSnap = await getDoc(archiveRef);
    const archiveData = archiveSnap.data();

    archiveResponseData = {
      description: archiveData?.description,
      title: archiveData?.title,
      videos: archiveData?.data.videos,
    };
  } catch (err) {
    console.error(err);
  }

  return archiveResponseData;
}
