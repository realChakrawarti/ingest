"use client";

import { useState } from "react";

import { getTimeDifference } from "~/shared/utils/time-diff";

export default function UpdatePing({ nextUpdate }: { nextUpdate: string }) {
  const [[when, diffUpdate], setTime] = useState(() =>
    getTimeDifference(nextUpdate)
  );

  setInterval(() => {
    setTime(getTimeDifference(nextUpdate));
  }, 5_000);

  return (
    <div className="text-sm">
      {when > 0 ? (
        <div className="flex items-center gap-2">
          <span className="bg-primary/75 inline-flex size-2 animate-ping rounded-full" />
          <p>{diffUpdate}</p>
        </div>
      ) : (
        <p>Please refresh the catalog for updated feed.</p>
      )}
    </div>
  );
}