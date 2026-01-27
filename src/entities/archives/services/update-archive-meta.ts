import { refs } from "~/shared/lib/firebase/refs";
import { allowMetadataUpdate } from "~/shared/utils/allow-metadata-update";
import { jsonResult } from "~/shared/utils/json-return";

import type { ZArchiveMeta } from "../models";

export async function updateArchiveMeta(
  archiveId: string,
  archiveMeta: ZArchiveMeta
) {
  const { isPublic, description, title } = archiveMeta;

  const archiveRef = refs.archives.doc(archiveId);
  const archiveData = (await archiveRef.get()).data();

  const metaUpdate = allowMetadataUpdate(archiveData?.lastUpdatedAt);

  if (archiveData) {
    if (metaUpdate.allow) {
      try {
        await archiveRef.update({
          description: description,
          isPublic: isPublic,
          lastUpdatedAt: new Date(),
          title: title,
        });

        return jsonResult
          .success("Archive details updated successfully.")
          .return();
      } catch (err) {
        if (err instanceof Error) {
          return jsonResult.error(err.message).return();
        }
        return jsonResult.error("Unable to update archive details.").return();
      }
    } else {
      return jsonResult.error(metaUpdate.message).return();
    }
  }

  return jsonResult.error("Archive not found.").return();
}
