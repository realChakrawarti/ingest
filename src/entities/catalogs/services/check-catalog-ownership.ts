import { refs } from "~/shared/lib/firebase/refs";

/**
 * Checks if a user owns a specific catalog
 * @param userId - The user ID to check ownership for
 * @param catalogId - The catalog ID to check
 * @returns Promise<boolean> - True if user owns the catalog, false otherwise
 */
export async function checkCatalogOwnership(
  userId: string,
  catalogId: string
): Promise<boolean> {
  try {
    const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);
    const userCatalogSnap = await userCatalogRef.get();
    return userCatalogSnap.exists;
  } catch (_err) {
    // Return false on any error (e.g., permission denied, network issues)
    return false;
  }
}