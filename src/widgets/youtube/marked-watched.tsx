import { useLiveQuery } from "dexie-react-hooks";
import { Check, Square } from "lucide-react";

import appConfig from "~/shared/app-config";
import { indexedDB } from "~/shared/lib/api/dexie";
import type { History, VideoData } from "~/shared/types-schema/types";
import { Button } from "~/shared/ui/button";

export default function MarkedWatched({ video }: { video: VideoData }) {
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

  // TODO: Once we have video duration, https://github.com/realChakrawarti/ingest/issues/172 set duration to that
  async function markWatched() {
    const payload: History = {
      completed: 100,
      duration: 0,
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
