import type { ZCatalogPodcast } from "../models";

import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

export async function deletePodcast(
  userId: string,
  catalogId: string,
  podcastToDelete: ZCatalogPodcast
) {
  const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);

  try {
    await userCatalogRef.update({
      list: FieldValue.arrayRemove(podcastToDelete),
      updatedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to delete the podcast of the catalog.";
  }
}