import { admin } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";

export async function deleteCatalog(userId: string, catalogId: string) {
  const catalogRef = refs.catalogs.doc(catalogId);

  const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);

  const batch = admin.db.batch();
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
