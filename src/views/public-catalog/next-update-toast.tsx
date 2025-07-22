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
      if (when < 0) {
        toast("You are currently viewing an older version.", {
          action: {
            label: "Refresh",
            onClick: () => window.location.reload(),
          },
          description: (
            <p className="text-muted-foreground">
              A new version of the catalog feed is available. Please refresh the
              page.
            </p>
          ),
          duration: 10_000,
        });
      } else {
        toast("Catalog feed is up-to-date.", {
          description: (
            <p className="text-muted-foreground">Next update: {updateString}</p>
          ),
        });
      }
    }
  }, [nextUpdate]);
  return <></>;
}
