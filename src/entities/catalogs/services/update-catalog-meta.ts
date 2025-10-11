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

export async function updateCatalogMeta(
  catalogId: string,
  payload: CatalogUpdatePayload
) {
  const { title, description, isPublic } = payload;
  const catalogRef = refs.catalogs.doc(catalogId);

  try {
    // If isPublic is being updated, check rate limit
    if (isPublic !== undefined) {
      // Get current catalog data to check last update time
      const catalogSnap = await catalogRef.get();
      const catalogData = catalogSnap.data();
      
      if (!catalogData) {
        return "Catalog not found.";
      }

      // Check rate limit for isPublic changes
      const rateLimitResult: RateLimitResult = checkIsPublicRateLimit(
        catalogData.isPublicUpdatedAt
      );

      if (!rateLimitResult.allowed) {
        return rateLimitResult.message;
      }

      // Update with isPublic and timestamp
      await catalogRef.update({
        description: description,
        title: title,
        isPublic: isPublic,
        isPublicUpdatedAt: getCurrentTimestamp(),
      });

      return "Catalog details and privacy status updated successfully.";
    } else {
      // Update without isPublic
      await catalogRef.update({
        description: description,
        title: title,
      });

      return "Catalog details updated successfully.";
    }
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to update catalog details.";
  }
}
