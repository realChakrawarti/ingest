import { refs } from "~/shared/lib/firebase";

/**
 * Retrieves the next scheduled update time for a specific catalog.
 *
 * @param catalogId - The unique identifier of the catalog
 * @returns The timestamp of the catalog's last update
 */
export async function getNextUpdate(catalogId: string) {
  const catalogRef = refs.catalogs.doc(catalogId);
  const catalogSnap = await catalogRef.get();
  const catalogData = catalogSnap.data();

  return catalogData?.data.updatedAt.toDate();
}
