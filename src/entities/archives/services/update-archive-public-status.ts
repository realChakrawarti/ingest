import { refs } from "~/shared/lib/firebase/refs";
import { 
  checkIsPublicRateLimit, 
  getCurrentTimestamp,
  type RateLimitResult 
} from "~/shared/lib/rate-limit/is-public-rate-limit";

/**
 * Toggles the isPublic status of an archive with rate limiting
 * 
 * @param archiveId - The ID of the archive to update
 * @param isPublic - The new isPublic status
 * @returns Success or error message
 */
export async function updateArchivePublicStatus(
  archiveId: string,
  isPublic: boolean
) {
  const archiveRef = refs.archives.doc(archiveId);

  try {
    // Get current archive data to check last update time
    const archiveSnap = await archiveRef.get();
    const archiveData = archiveSnap.data();
    
    if (!archiveData) {
      return "Archive not found.";
    }

    // Check if the value is actually changing
    const currentIsPublic = archiveData.isPublic ?? true;
    if (currentIsPublic === isPublic) {
      return `Archive is already ${isPublic ? 'public' : 'private'}.`;
    }

    // Check rate limit for isPublic changes
    const rateLimitResult: RateLimitResult = checkIsPublicRateLimit(
      archiveData.isPublicUpdatedAt
    );

    if (!rateLimitResult.allowed) {
      return rateLimitResult.message;
    }

    // Update isPublic status and timestamp
    await archiveRef.update({
      isPublic: isPublic,
      isPublicUpdatedAt: getCurrentTimestamp(),
    });

    return `Archive has been made ${isPublic ? 'public' : 'private'} successfully.`;
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to update archive privacy status.";
  }
}