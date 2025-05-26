import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

export async function deleteCatalog(userId: string, catalogId: string) {
  const catalogRef = adminDb.collection(COLLECTION.catalogs).doc(catalogId);

  const userCatalogRef = adminDb
    .collection(COLLECTION.users)
    .doc(userId)
    .collection(COLLECTION.catalogs)
    .doc(catalogId);

  const batch = adminDb.batch();
  try {
    batch.delete(catalogRef);
    batch.delete(userCatalogRef);

    await batch.commit();
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to delete the catalog.";
  }
}
