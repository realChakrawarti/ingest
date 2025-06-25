import { db, refs } from "~/shared/lib/firebase";

export async function deleteCatalog(userId: string, catalogId: string) {
  const catalogRef = refs.catalogs.doc(catalogId);

  const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);

  const batch = db.admin.batch();
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
