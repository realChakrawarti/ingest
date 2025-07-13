import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

import type { ZCatalogSubreddit } from "../models";

export async function deleteSubreddit(
  userId: string,
  catalogId: string,
  subredditToDelete: ZCatalogSubreddit
) {
  const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);

  try {
    await userCatalogRef.update({
      list: FieldValue.arrayRemove(subredditToDelete),
      updatedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to delete the subreddit of the catalog.";
  }
}
