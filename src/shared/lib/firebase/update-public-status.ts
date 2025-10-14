import type { DocumentReference, DocumentData } from "firebase-admin/firestore";
import { FieldValue } from "firebase-admin/firestore";
import { 
  checkIsPublicRateLimit,
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
    // Run the entire operation in a transaction to ensure atomicity
    const result = await docRef.firestore.runTransaction(async (transaction) => {
      // Read document data within the transaction
      const docSnap = await transaction.get(docRef);
      const docData = docSnap.data();
      
      if (!docData) {
        return {
          success: false,
          error: 'NOT_FOUND' as const,
          message: `${entityName} not found.`
        };
      }

      // Check if the value is actually changing
      const currentIsPublic = docData.isPublic ?? true;
      if (currentIsPublic === isPublic) {
        return {
          success: false,
          error: 'NO_CHANGE' as const,
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
          error: 'RATE_LIMIT' as const,
          message: rateLimitResult.message
        };
      }

      // Perform the atomic update with server timestamp
      transaction.update(docRef, {
        isPublic: isPublic,
        isPublicUpdatedAt: FieldValue.serverTimestamp(),
      });

      return {
        success: true as const,
        message: `${entityName} has been made ${isPublic ? 'public' : 'private'} successfully.`
      };
    });

    return result;
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