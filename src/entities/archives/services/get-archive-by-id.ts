import { timestampUTC } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";
import Log from "~/shared/utils/terminal-logger";

import { ArchiveDocumentSchema, type ZArchiveByID } from "../models";

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

    const { success, error, data } =
      ArchiveDocumentSchema.safeParse(archiveData);

    if (success && data.data.videos) {
      const archiveResponseData: ZArchiveByID = {
        description: data.description,
        isPublic: data.isPublic,
        title: data.title,
        updatedAt: timestampUTC(data.data.updatedAt),
        videos: data.data.videos,
      };

      return archiveResponseData;
    } else {
      throw Error(error?.message ?? "Unable to parse archive by ID.");
    }
  } catch (err) {
    Log.fatal("Unable to retrieve archive by id.", err);
  }
}
