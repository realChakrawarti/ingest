import { refs } from "~/shared/lib/firebase/refs";
import { 
  checkIsPublicRateLimit, 
  getCurrentTimestamp,
  type RateLimitResult 
} from "~/shared/lib/rate-limit/is-public-rate-limit";

/**
 * Toggles the isPublic status of a catalog with rate limiting
 * 
 * @param catalogId - The ID of the catalog to update
 * @param isPublic - The new isPublic status
 * @returns Success or error message
 */
export async function updateCatalogPublicStatus(
  catalogId: string,
  isPublic: boolean
) {
  const catalogRef = refs.catalogs.doc(catalogId);

  try {
    // Get current catalog data to check last update time
    const catalogSnap = await catalogRef.get();
    const catalogData = catalogSnap.data();
    
    if (!catalogData) {
      return "Catalog not found.";
    }

    // Check if the value is actually changing
    const currentIsPublic = catalogData.isPublic ?? true;
    if (currentIsPublic === isPublic) {
      return `Catalog is already ${isPublic ? 'public' : 'private'}.`;
    }

    // Check rate limit for isPublic changes
    const rateLimitResult: RateLimitResult = checkIsPublicRateLimit(
      catalogData.isPublicUpdatedAt
    );

    if (!rateLimitResult.allowed) {
      return rateLimitResult.message;
    }

    // Update isPublic status and timestamp
    await catalogRef.update({
      isPublic: isPublic,
      isPublicUpdatedAt: getCurrentTimestamp(),
    });

    return `Catalog has been made ${isPublic ? 'public' : 'private'} successfully.`;
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to update catalog privacy status.";
  }
}