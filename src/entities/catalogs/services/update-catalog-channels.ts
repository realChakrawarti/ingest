import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase";

import type { CatalogList } from "../models";

export async function updateCatalogChannels(
  userId: string,
  catalogId: string,
  channel: CatalogList<"channel">
) {
  const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);

  try {
    await userCatalogRef.update({
      list: FieldValue.arrayUnion(channel),
      updatedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to update catalog channels.";
  }
}
