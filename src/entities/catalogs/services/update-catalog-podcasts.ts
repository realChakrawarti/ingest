import type { ZCatalogPodcast } from "../models";

import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

export async function updateCatalogPodcasts(
  userId: string,
  catalogId: string,
  podcasts: ZCatalogPodcast[]
) {
  const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);

  if (podcasts?.length) {
    await userCatalogRef.update({
      list: FieldValue.arrayUnion(...podcasts),
      updatedAt: new Date(),
    });
  }
}