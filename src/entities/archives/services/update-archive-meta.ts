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

export interface ArchiveUpdateResult {
  success: boolean;
  message: string;
  statusCode?: number;
}

export async function updateArchiveMeta(
  archiveId: string,
  archiveMeta: ArchiveUpdatePayload
): Promise<ArchiveUpdateResult> {
  const { title, description, isPublic } = archiveMeta;
  const archiveRef = refs.archives.doc(archiveId);

  try {
    // If isPublic is being updated, check rate limit
    if (isPublic !== undefined) {
      // Get current archive data to check last update time
      const archiveSnap = await archiveRef.get();
      const archiveData = archiveSnap.data();
      
      if (!archiveData) {
        return {
          success: false,
          message: "Archive not found.",
          statusCode: 404
        };
      }

      // Check rate limit for isPublic changes
      const rateLimitResult: RateLimitResult = checkIsPublicRateLimit(
        archiveData.isPublicUpdatedAt
      );

      if (!rateLimitResult.allowed) {
        return {
          success: false,
          message: rateLimitResult.message,
          statusCode: 429
        };
      }

      // Update with isPublic and timestamp
      await archiveRef.update({
        description: description,
        title: title,
        isPublic: isPublic,
        isPublicUpdatedAt: getCurrentTimestamp(),
      });

      return {
        success: true,
        message: "Archive details and privacy status updated successfully."
      };
    } else {
      // Update without isPublic
      await archiveRef.update({
        description: description,
        title: title,
      });

      return {
        success: true,
        message: "Archive details updated successfully."
      };
    }
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        message: err.message,
        statusCode: 500
      };
    }
    return {
      success: false,
      message: "Unable to update archive details.",
      statusCode: 500
    };
  }
}
