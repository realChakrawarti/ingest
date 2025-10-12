import type { DocumentReference, DocumentData, Timestamp } from "firebase-admin/firestore";
import { 
  checkIsPublicRateLimit, 
  getCurrentTimestamp,
  type RateLimitResult 
} from "~/shared/lib/rate-limit/is-public-rate-limit";

export interface UpdateWithPublicStatusResult {
  success: boolean;
  message: string;
  statusCode?: number;
}

export interface UpdateWithPublicStatusOptions {
  isPublicUpdatedAt?: Timestamp;
  entityName?: string;
}

/**
 * Generic helper to update document metadata with optional public status and rate limiting
 * 
 * @param docRef - The Firestore document reference to update
 * @param updatePayload - The fields to update (including optional isPublic)
 * @param currentData - Already-fetched document data (optional, will fetch if not provided)
 * @param options - Optional configuration including isPublicUpdatedAt timestamp and entity name
 * @returns UpdateWithPublicStatusResult indicating success/failure with appropriate status codes
 */
export async function updateWithPublicStatus(
  docRef: DocumentReference<DocumentData>,
  updatePayload: Record<string, any>,
  currentData?: DocumentData | null,
  options: UpdateWithPublicStatusOptions = {}
): Promise<UpdateWithPublicStatusResult> {
  const { isPublicUpdatedAt, entityName = "Document" } = options;
  const { isPublic, ...otherFields } = updatePayload;

  try {
    // If isPublic is being updated, check rate limit
    if (isPublic !== undefined) {
      let docData = currentData;
      
      // If currentData is not provided or isPublicUpdatedAt is not available, fetch the document
      if (!docData || (!isPublicUpdatedAt && !docData.isPublicUpdatedAt)) {
        const docSnap = await docRef.get();
        docData = docSnap.data();
        
        if (!docData) {
          return {
            success: false,
            message: `${entityName} not found.`,
            statusCode: 404
          };
        }
      }

      // Use provided timestamp or fallback to document data
      const lastUpdatedTimestamp = isPublicUpdatedAt || docData.isPublicUpdatedAt;

      // Check rate limit for isPublic changes
      const rateLimitResult: RateLimitResult = checkIsPublicRateLimit(lastUpdatedTimestamp);

      if (!rateLimitResult.allowed) {
        return {
          success: false,
          message: rateLimitResult.message,
          statusCode: 429
        };
      }

      // Update with isPublic and timestamp
      await docRef.update({
        ...otherFields,
        isPublic: isPublic,
        isPublicUpdatedAt: getCurrentTimestamp(),
      });

      return {
        success: true,
        message: `${entityName} details and privacy status updated successfully.`
      };
    } else {
      // Update without isPublic
      // Check if there are any fields to update
      if (Object.keys(otherFields).length === 0) {
        return {
          success: false,
          message: 'No updatable fields provided.',
          statusCode: 400
        };
      }

      await docRef.update(otherFields);

      return {
        success: true,
        message: `${entityName} details updated successfully.`
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
      message: `Unable to update ${entityName.toLowerCase()} details.`,
      statusCode: 500
    };
  }
}