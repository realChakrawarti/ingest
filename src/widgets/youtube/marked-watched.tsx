import { useLiveQuery } from "dexie-react-hooks";
import { Check, Square } from "lucide-react";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import appConfig from "~/shared/app-config";
import { indexedDB } from "~/shared/lib/api/dexie";
import type { History } from "~/shared/types-schema/types";
import { Button } from "~/shared/ui/button";

export default function MarkedWatched({
  video,
}: {
  video: ZVideoMetadataCompatible;
}) {
  const videoProgress = useLiveQuery(() =>
    indexedDB["history"].get(video.videoId)
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

  if (videoProgress && videoProgress.completed > appConfig.watchedPercentage) {
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

  async function markWatched() {
    const payload: History = {
      completed: 100,
      duration: video?.videoDuration ? video.videoDuration - 5 : 0,
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
