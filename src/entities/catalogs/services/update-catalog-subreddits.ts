import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

import type { ZCatalogSubreddit } from "../models";

export async function updateCatalogSubreddits(
  userId: string,
  catalogId: string,
  subreddits: ZCatalogSubreddit[]
) {
  const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);

  if (!subreddits[0]?.subredditName) {
    throw Error("Provided playlist doesn't contain any channel");
  }

  if (subreddits.length) {
    await userCatalogRef.update({
      list: FieldValue.arrayUnion(...subreddits),
      updatedAt: new Date(),
    });
  }
}
