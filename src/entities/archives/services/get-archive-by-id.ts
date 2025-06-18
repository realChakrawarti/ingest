import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";
import TerminalLogger from "~/shared/lib/terminal-logger";

import { ArchiveByIdResponse } from "../models";

/**
 * This function sends the response of a specific catalog provided a valid catalogId
 * @param archiveId
 * @param userId
 * @returns
 */

// TODO: How would I handle the data? VideoId as an array in userArchive and data
// retrived from API stored as an object in the main archive?
export async function getArchiveById(archiveId: string) {
  const archiveRef = adminDb.collection(COLLECTION.archives).doc(archiveId);

  try {
    // Get title and description
    const archiveSnap = await archiveRef.get();
    const archiveData = archiveSnap.data();

    const archiveResponseData: ArchiveByIdResponse = {
      description: archiveData?.description,
      title: archiveData?.title,
      videos: archiveData?.data.videos,
    };

    return archiveResponseData;
  } catch (err) {
    TerminalLogger.fatal("Unable to retrieve archive by id.", err);
  }
}
