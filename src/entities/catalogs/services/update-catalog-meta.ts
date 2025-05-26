import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

type CatalogMeta = {
  title: string;
  description: string;
};

export async function updateCatalogMeta(
  catalogId: string,
  payload: CatalogMeta
) {
  const { title, description } = payload;
  const catalogRef = adminDb.collection(COLLECTION.catalogs).doc(catalogId);

  try {
    await catalogRef.update({
      title: title,
      description: description,
    });

    return "Catalog details updated successfully.";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to update catalog details.";
  }
}
