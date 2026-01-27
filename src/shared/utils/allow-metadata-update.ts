import type { Timestamp } from "firebase/firestore";

import appConfig from "~/shared/app-config";

type AllowMetadataUpdate = {
  allow: boolean;
  message: string;
};

/*
 * @description Check if update could be done as per last `lastUpdatedAt`
 */
export function allowMetadataUpdate(
  lastUpdate: Timestamp | undefined
): AllowMetadataUpdate {
  if (!lastUpdate) return { allow: true, message: "Unavailable" };
  const timeDiff = Date.now() - lastUpdate.toDate().getTime();

  const remainingTimeMs = appConfig.metadataUpdateCooldown - timeDiff;
  if (remainingTimeMs <= 0) {
    return { allow: true, message: "Ok" };
  }

  const minutesDiff = Math.ceil(remainingTimeMs / (60 * 1000));
  return {
    allow: false,
    message: `Please wait ${minutesDiff} minutes before updating again.`,
  };
}
