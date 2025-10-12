import type { DocumentReference, DocumentData } from "firebase-admin/firestore";
import { 
  checkIsPublicRateLimit, 
  getCurrentTimestamp,
  type RateLimitResult 
} from "~/shared/lib/rate-limit/is-public-rate-limit";

export type PublicStatusUpdateResult = 
  | { success: true; message: string }
  | { 
      success: false; 
      error: 'NOT_FOUND' | 'RATE_LIMIT' | 'NO_CHANGE' | 'UPDATE_FAILED'; 
      message: string 
    };

/**
 * Generic helper to update the isPublic status of any document with rate limiting
 * 
 * @param docRef - The Firestore document reference to update
 * @param isPublic - The new isPublic status
 * @param entityName - The name of the entity (e.g., 'Archive', 'Catalog') for error messages
 * @returns Structured result indicating success/failure with error type
 */
export async function updatePublicStatus(
  docRef: DocumentReference<DocumentData>,
  isPublic: boolean,
  entityName: string
): Promise<PublicStatusUpdateResult> {
  try {
    // Get current document data to check last update time
    const docSnap = await docRef.get();
    const docData = docSnap.data();
    
    if (!docData) {
      return {
        success: false,
        error: 'NOT_FOUND',
        message: `${entityName} not found.`
      };
    }

    // Check if the value is actually changing
    const currentIsPublic = docData.isPublic ?? true;
    if (currentIsPublic === isPublic) {
      return {
        success: false,
        error: 'NO_CHANGE',
        message: `${entityName} is already ${isPublic ? 'public' : 'private'}.`
      };
    }

    // Check rate limit for isPublic changes
    const rateLimitResult: RateLimitResult = checkIsPublicRateLimit(
      docData.isPublicUpdatedAt
    );

    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: 'RATE_LIMIT',
        message: rateLimitResult.message
      };
    }

    // Update isPublic status and timestamp
    await docRef.update({
      isPublic: isPublic,
      isPublicUpdatedAt: getCurrentTimestamp(),
    });

    return {
      success: true,
      message: `${entityName} has been made ${isPublic ? 'public' : 'private'} successfully.`
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        success: false,
        error: 'UPDATE_FAILED',
        message: err.message
      };
    }
    return {
      success: false,
      error: 'UPDATE_FAILED',
      message: `Unable to update ${entityName.toLowerCase()} privacy status.`
    };
  }
}