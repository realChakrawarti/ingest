import type { ZPickByID } from "../models";

import { timestampUTC } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";
import { jsonResult } from "~/shared/utils/json-return";

/**
 * This function sends the response of a specific catalog provided a valid catalogId
 * @param pickId
 * @param userId
 * @returns
 */

// TODO: How would I handle the data? VideoId as an array in userPick and data
// retrived from API stored as an object in the main pick?
export async function getPickById(pickId: string) {
  const pickRef = refs.picks.doc(pickId);

  try {
    // Get title and description
    const pickSnap = await pickRef.get();
    const pickData = pickSnap.data();

    const pickResponseData: ZPickByID = {
      description: pickData?.description || "",
      isPublic: pickData?.isPublic ?? true,
      lastUpdatedAt: timestampUTC(pickData?.lastUpdatedAt),
      title: pickData?.title || "",
      updatedAt: timestampUTC(pickData?.data.updatedAt),
      videos: pickData?.data?.videos ?? [],
    };

    return jsonResult.success(pickResponseData).return();
  } catch {
    return jsonResult.error("Unable to retrieve pick by identifier.").return();
  }
}