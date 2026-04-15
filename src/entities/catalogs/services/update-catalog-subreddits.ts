import type { ZCatalogSubreddit } from "../models";

import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

export async function updateCatalogSubreddits(
  userId: string,
  catalogId: string,
  subreddits: ZCatalogSubreddit[]
) {
  const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);

  if (subreddits?.length) {
    await userCatalogRef.update({
      list: FieldValue.arrayUnion(...subreddits),
      updatedAt: new Date(),
    });
  }
}