"use client";

import { useState } from "react";

import useInterval from "~/shared/hooks/use-interval";
import { getTimeDifference } from "~/shared/utils/time-diff";

export default function UpdatePing({ nextUpdate }: { nextUpdate: string }) {
  const [[when, diffUpdate], setTime] = useState(() =>
    getTimeDifference({
      value: nextUpdate,
      nearest: false,
      suffixEnabled: true,
      limitMonth: false,
    })
  );

  useInterval(
    () =>
      setTime(
        getTimeDifference({
          value: nextUpdate,
          nearest: false,
          suffixEnabled: true,
          limitMonth: false,
        })
      ),
    5_000
  );

  return (
    <div className="text-sm">
      {when > 0 ? (
        <div className="flex items-center gap-2">
          <span className="bg-primary/75 inline-flex size-2 animate-ping rounded-full" />
          <p>{diffUpdate}</p>
        </div>
      ) : (
        <p>Please refresh for the updated feed.</p>
      )}
    </div>
  );
}