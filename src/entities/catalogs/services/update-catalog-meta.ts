import { refs } from "~/shared/lib/firebase/refs";

import type { ZCatalogMeta } from "../models";

export async function updateCatalogMeta(
  catalogId: string,
  payload: ZCatalogMeta
) {
  const { title, description } = payload;
  const catalogRef = refs.catalogs.doc(catalogId);

  try {
    await catalogRef.update({
      description: description,
      title: title,
    });

    return "Catalog details updated successfully.";
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to update catalog details.";
  }
}
