import { timestampUTC } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";
import { jsonResult } from "~/shared/utils/json-return";

import type { ZArchiveByID } from "../models";

/**
 * This function sends the response of a specific catalog provided a valid catalogId
 * @param archiveId
 * @param userId
 * @returns
 */

// TODO: How would I handle the data? VideoId as an array in userArchive and data
// retrived from API stored as an object in the main archive?
export async function getArchiveById(archiveId: string) {
  const archiveRef = refs.archives.doc(archiveId);

  try {
    // Get title and description
    const archiveSnap = await archiveRef.get();
    const archiveData = archiveSnap.data();

    const archiveResponseData: ZArchiveByID = {
      description: archiveData?.description || "",
      isPublic: archiveData?.isPublic ?? true,
      lastUpdatedAt: timestampUTC(archiveData?.lastUpdatedAt),
      title: archiveData?.title || "",
      updatedAt: timestampUTC(archiveData?.data.updatedAt),
      videos: archiveData?.data?.videos ?? [],
    };

    return jsonResult.success(archiveResponseData).return();
  } catch (_err) {
    return jsonResult
      .error("Unable to retrieve archive by identifier.")
      .return();
  }
}
