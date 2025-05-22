"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { Check } from "lucide-react";

import appConfig from "~/shared/app-config";
import { indexedDB } from "~/shared/lib/api/dexie";

import OverlayTip from "../overlay-tip";

export function WatchedStatus({ videoId }: { videoId: string }) {
  const videoProgress = useLiveQuery(() => indexedDB["history"].get(videoId));

  if (videoProgress && videoProgress.completed > appConfig.watchedPercentage) {
    return (
      <div className="absolute bottom-2 left-[2px] md:left-0 group/status cursor-default">
        <OverlayTip
          className="px-[5px] py-2 flex gap-1 place-items-center rounded-r-md"
          id="status"
          aria-label="Show video completion status"
        >
          <div className="hidden group-hover/status:block text-xs">Watched</div>
          <Check className="size-4 flex-grow" />
        </OverlayTip>
      </div>
    );
  }

  return null;
}
