"use client";

import { Check } from "lucide-react";

import { useLiveQuery } from "dexie-react-hooks";

import { useLocalUserSettings } from "~/shared/hooks/use-local-user-settings";
import { indexedDB } from "~/shared/lib/api/dexie";

import OverlayTip from "../overlay-tip";

export function WatchedStatus({ videoId }: { videoId: string }) {
  const videoProgress = useLiveQuery(() => indexedDB["history"].get(videoId));

  const { localUserSettings } = useLocalUserSettings(null);

  if (
    videoProgress &&
    videoProgress.completed > localUserSettings.watchedPercentage
  ) {
    return (
      <div className="group/status absolute top-2 left-0 cursor-default">
        <OverlayTip
          className="flex place-items-center gap-1 rounded-r-md px-1.25 py-2"
          id="status"
          aria-label="Show video completion status"
        >
          <div className="hidden text-xs group-hover/status:block">Watched</div>
          <Check className="size-4 grow" />
        </OverlayTip>
      </div>
    );
  }

  return null;
}