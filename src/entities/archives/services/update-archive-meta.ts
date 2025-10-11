import { refs } from "~/shared/lib/firebase/refs";
import { 
  checkIsPublicRateLimit, 
  getCurrentTimestamp,
  type RateLimitResult 
} from "~/shared/lib/rate-limit/is-public-rate-limit";

import type { ZArchiveMeta } from "../models";

interface ArchiveUpdatePayload extends ZArchiveMeta {
  isPublic?: boolean;
}

export async function updateArchiveMeta(
  archiveId: string,
  archiveMeta: ArchiveUpdatePayload
) {
  const { title, description, isPublic } = archiveMeta;
  const archiveRef = refs.archives.doc(archiveId);

  try {
    // If isPublic is being updated, check rate limit
    if (isPublic !== undefined) {
      // Get current archive data to check last update time
      const archiveSnap = await archiveRef.get();
      const archiveData = archiveSnap.data();
      
      if (!archiveData) {
        return "Archive not found.";
      }

      // Check rate limit for isPublic changes
      const rateLimitResult: RateLimitResult = checkIsPublicRateLimit(
        archiveData.isPublicUpdatedAt
      );

      if (!rateLimitResult.allowed) {
        return rateLimitResult.message;
      }

      // Update with isPublic and timestamp
      await archiveRef.update({
        description: description,
        title: title,
        isPublic: isPublic,
        isPublicUpdatedAt: getCurrentTimestamp(),
      });

      return "Archive details and privacy status updated successfully.";
    } else {
      // Update without isPublic
      await archiveRef.update({
        description: description,
        title: title,
      });

      return "Archive details updated successfully.";
    }
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to update archive details.";
  }
}
