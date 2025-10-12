import { refs } from "~/shared/lib/firebase/refs";
import { updatePublicStatus, type PublicStatusUpdateResult } from "~/shared/lib/firebase/update-public-status";

/**
 * Toggles the isPublic status of an archive with rate limiting
 * 
 * @param archiveId - The ID of the archive to update
 * @param isPublic - The new isPublic status
 * @returns Structured result indicating success/failure with error type
 */
export async function updateArchivePublicStatus(
  archiveId: string,
  isPublic: boolean
): Promise<PublicStatusUpdateResult> {
  const archiveRef = refs.archives.doc(archiveId);
  return updatePublicStatus(archiveRef, isPublic, 'Archive');
}