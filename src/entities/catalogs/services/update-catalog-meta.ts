import { refs } from "~/shared/lib/firebase/refs";
import { allowMetadataUpdate } from "~/shared/utils/allow-metadata-update";
import { jsonResult } from "~/shared/utils/json-return";

import type { ZCatalogMeta } from "../models";

export async function updateCatalogMeta(
  catalogId: string,
  payload: Partial<ZCatalogMeta>
) {
  const { title, description, isPublic } = payload;
  const catalogRef = refs.catalogs.doc(catalogId);
  const catalogData = (await catalogRef.get()).data();

  const metaUpdate = allowMetadataUpdate(catalogData?.lastUpdatedAt);

  if (catalogData) {
    if (metaUpdate.allow) {
      try {
        await catalogRef.update({
          description: description,
          isPublic: isPublic,
          lastUpdatedAt: new Date(),
          title: title,
        });

        return jsonResult
          .success("Catalog details updated successfully.")
          .return();
      } catch (err) {
        if (err instanceof Error) {
          return jsonResult.error(err.message).return();
        }
        return jsonResult.error("Unable to update catalog details.").return();
      }
    } else {
      return jsonResult.error(metaUpdate.message).return();
    }
  }

  return jsonResult.error("Catalog not found.").return();
}
