"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { Check, Square } from "lucide-react";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import { useLocalUserSettings } from "~/shared/hooks/use-local-user-settings";
import { useIsMobile } from "~/shared/hooks/use-mobile";
import { indexedDB } from "~/shared/lib/api/dexie";
import type { History } from "~/shared/types-schema/types";
import { Button } from "~/shared/ui/button";
import { cn } from "~/shared/utils/tailwind-merge";

export default function MarkedWatched({
  video,
}: {
  video: ZVideoMetadataCompatible;
}) {
  const videoProgress = useLiveQuery(() =>
    indexedDB["history"].get(video.videoId)
  );

  const isMobile = useIsMobile();

  const { localUserSettings } = useLocalUserSettings(null);

  async function markUnwatched() {
    const payload: History = {
      completed: 0,
      duration: 0,
      updatedAt: Date.now(),
      ...video,
    };

    await indexedDB["history"].put(payload);
  }

  if (
    videoProgress &&
    videoProgress.completed > localUserSettings.watchedPercentage
  ) {
    return (
      <Button
        variant="ghost"
        className={cn(
          "flex gap-2 justify-start hover:bg-accent rounded-lg p-2 cursor-pointer w-full",
          isMobile ? "text-base" : "text-sm"
        )}
        onClick={markUnwatched}
      >
        <Square className={cn(isMobile ? "size-6" : "size-4")} />
        Marked unwatched
      </Button>
    );
  }

  // TODO: When a playing video is marked as watched, maybe stop the video?
  // Currently using the playerRef from "playing-currently-store" de-syncs the playerRef, needs further investigation
  async function markWatched() {
    const percentCompleted = localUserSettings.watchedPercentage + 1;
    const markedCompletionDuration = video?.videoDuration
      ? video.videoDuration -
        Number.parseInt(
          ((video.videoDuration * (100 - percentCompleted)) / 100).toFixed(2),
          10
        )
      : 0;
    const payload: History = {
      completed: percentCompleted,
      duration: markedCompletionDuration,
      updatedAt: Date.now(),
      ...video,
    };

    await indexedDB["history"].put(payload);
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        "flex gap-2 justify-start hover:bg-accent rounded-lg p-2 cursor-pointer w-full",
        isMobile ? "text-base" : "text-sm"
      )}
      onClick={markWatched}
    >
      <Check className={cn(isMobile ? "size-6" : "size-4")} />
      Marked watched
    </Button>
  );
}
