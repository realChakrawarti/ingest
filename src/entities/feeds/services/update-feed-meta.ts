import type { ZFeedMeta } from "../models";

import { refs } from "~/shared/lib/firebase/refs";
import { allowMetadataUpdate } from "~/shared/utils/allow-metadata-update";
import { jsonResult } from "~/shared/utils/json-return";

export async function updateFeedMeta(
  feedId: string,
  payload: Partial<ZFeedMeta>
) {
  const { title, description, isPublic } = payload;
  const feedRef = refs.feeds.doc(feedId);
  const feedData = (await feedRef.get()).data();

  const metaUpdate = allowMetadataUpdate(feedData?.lastUpdatedAt);

  if (feedData) {
    if (metaUpdate.allow) {
      try {
        await feedRef.update({
          description: description,
          isPublic: isPublic,
          lastUpdatedAt: new Date(),
          title: title,
        });

        return jsonResult
          .success("Feed details updated successfully.")
          .return();
      } catch (err) {
        if (err instanceof Error) {
          return jsonResult.error(err.message).return();
        }
        return jsonResult.error("Unable to update feed details.").return();
      }
    } else {
      return jsonResult.error(metaUpdate.message).return();
    }
  }

  return jsonResult.error("Feed not found.").return();
}
