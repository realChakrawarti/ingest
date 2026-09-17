import type { ZPickMeta } from "../models";

import { refs } from "~/shared/lib/firebase/refs";
import { allowMetadataUpdate } from "~/shared/utils/allow-metadata-update";
import { jsonResult } from "~/shared/utils/json-return";

export async function updatePickMeta(pickId: string, pickMeta: ZPickMeta) {
  const { isPublic, description, title } = pickMeta;

  const pickRef = refs.picks.doc(pickId);
  const pickData = (await pickRef.get()).data();

  const metaUpdate = allowMetadataUpdate(pickData?.lastUpdatedAt);

  if (pickData) {
    if (metaUpdate.allow) {
      try {
        await pickRef.update({
          description: description,
          isPublic: isPublic,
          lastUpdatedAt: new Date(),
          title: title,
        });

        return jsonResult
          .success("Pick details updated successfully.")
          .return();
      } catch (err) {
        if (err instanceof Error) {
          return jsonResult.error(err.message).return();
        }
        return jsonResult.error("Unable to update pick details.").return();
      }
    } else {
      return jsonResult.error(metaUpdate.message).return();
    }
  }

  return jsonResult.error("Pick not found.").return();
}