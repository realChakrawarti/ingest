"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { getTimeDifference } from "~/shared/utils/time-diff";

export default function NextUpdateToast({
  nextUpdate,
}: {
  nextUpdate: string | undefined;
}) {
  useEffect(() => {
    if (nextUpdate) {
      const [when, updateString] = getTimeDifference(nextUpdate);
      if (when > 0) {
        toast("You are currently viewing an older version.", {
          description:
            "A new version of the catalog is available. Please refresh the page.",
          duration: 10_000,
        });
      } else {
        toast(`Next update: ${updateString}`);
      }
    }
  }, [nextUpdate]);
  return <></>;
}
