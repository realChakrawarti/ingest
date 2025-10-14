import { refs } from "~/shared/lib/firebase/refs";
import { updatePublicStatus, type PublicStatusUpdateResult } from "~/shared/lib/firebase/update-public-status";

/**
 * Toggles the isPublic status of a catalog with rate limiting
 * 
 * @param catalogId - The ID of the catalog to update
 * @param isPublic - The new isPublic status
 * @returns Structured result indicating success/failure with error type
 */
export async function updateCatalogPublicStatus(
  catalogId: string,
  isPublic: boolean
): Promise<PublicStatusUpdateResult> {
  const catalogRef = refs.catalogs.doc(catalogId);
  return updatePublicStatus(catalogRef, isPublic, 'Catalog');
}