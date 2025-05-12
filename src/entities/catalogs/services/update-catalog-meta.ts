import { doc, updateDoc } from "firebase/firestore";

import { db } from "~/shared/lib/firebase/client";
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
  const catalogRef = doc(db, COLLECTION.catalogs, catalogId);

  try {
    await updateDoc(catalogRef, {
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
