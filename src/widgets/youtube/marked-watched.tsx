import { useLiveQuery } from "dexie-react-hooks";
import { Check, Square } from "lucide-react";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import { useLocalStorage } from "~/shared/hooks/use-local-storage";
import { indexedDB } from "~/shared/lib/api/dexie";
import { LOCAL_USER_SETTINGS } from "~/shared/lib/constants";
import type { History, TUserSettings } from "~/shared/types-schema/types";
import { Button } from "~/shared/ui/button";

export default function MarkedWatched({
  video,
}: {
  video: ZVideoMetadataCompatible;
}) {
  const videoProgress = useLiveQuery(() =>
    indexedDB["history"].get(video.videoId)
  );

  const [userLocalSettings] = useLocalStorage<TUserSettings>(
    LOCAL_USER_SETTINGS,
    null
  );

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
    videoProgress.completed > userLocalSettings.watchedPercentage
  ) {
    return (
      <Button
        variant="ghost"
        className="flex gap-2 justify-start hover:bg-accent rounded-lg p-2 text-xs cursor-pointer w-full"
        onClick={markUnwatched}
      >
        <Square className="h-4 w-4 mr-2" />
        Marked unwatched
      </Button>
    );
  }

  // TODO: When a playing video is marked as watched, maybe stop the video?
  // Currently using the playerRef from "playing-currently-store" de-syncs the playerRef, needs further investigation
  async function markWatched() {
    const percentCompleted = userLocalSettings.watchedPercentage + 1;
    const markedCompletionDuration = video?.videoDuration
      ? video.videoDuration -
        parseInt(
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
      className="flex gap-2 justify-start hover:bg-accent rounded-lg p-2 text-xs cursor-pointer w-full"
      onClick={markWatched}
    >
      <Check className="h-4 w-4 mr-2" />
      Marked watched
    </Button>
  );
}
