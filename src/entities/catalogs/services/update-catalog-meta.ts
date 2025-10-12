import { refs } from "~/shared/lib/firebase/refs";
import { 
  checkIsPublicRateLimit, 
  getCurrentTimestamp,
  type RateLimitResult 
} from "~/shared/lib/rate-limit/is-public-rate-limit";

import type { ZCatalogMeta } from "../models";

interface CatalogUpdatePayload extends ZCatalogMeta {
  isPublic?: boolean;
}

export interface CatalogUpdateResult {
  success: boolean;
  message: string;
  statusCode?: number;
}

export async function updateCatalogMeta(
  catalogId: string,
  payload: CatalogUpdatePayload
): Promise<CatalogUpdateResult> {
  const { title, description, isPublic } = payload;
  const catalogRef = refs.catalogs.doc(catalogId);

  try {
    // If isPublic is being updated, check rate limit
    if (isPublic !== undefined) {
      // Get current catalog data to check last update time
      const catalogSnap = await catalogRef.get();
      const catalogData = catalogSnap.data();
      
      if (!catalogData) {
        return {
          success: false,
          message: "Catalog not found.",
          statusCode: 404
        };
      }

      // Check rate limit for isPublic changes
      const rateLimitResult: RateLimitResult = checkIsPublicRateLimit(
        catalogData.isPublicUpdatedAt
      );

      if (!rateLimitResult.allowed) {
        return {
          success: false,
          message: rateLimitResult.message,
          statusCode: 429
        };
      }

      // Update with isPublic and timestamp
      await catalogRef.update({
        description: description,
        title: title,
        isPublic: isPublic,
        isPublicUpdatedAt: getCurrentTimestamp(),
      });

      return {
        success: true,
        message: "Catalog details and privacy status updated successfully."
      };
    } else {
      // Update without isPublic
      await catalogRef.update({
        description: description,
        title: title,
      });

      return {
        success: true,
        message: "Catalog details updated successfully."
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
      message: "Unable to update catalog details.",
      statusCode: 500
    };
  }
}
