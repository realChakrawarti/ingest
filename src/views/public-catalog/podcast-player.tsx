"use client";

import type { RefObject } from "react";
import { Volume2Icon } from "lucide-react";

import type { ZCatalogPodcastItem } from "~/entities/catalogs/models";

import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui/popover";
import { Slider } from "~/shared/ui/slider";
import formatSecondsToHMS from "~/shared/utils/format-seconds-HMS";

import { usePodcastPlayer } from "./use-podcast-player";

export function PodcastPlayer({
  podcast,
  audioPlayerRef,
}: {
  podcast: ZCatalogPodcastItem;
  audioPlayerRef: RefObject<HTMLAudioElement | null>;
}) {
  const { current, onSeek, volume, onVolume } =
    usePodcastPlayer(audioPlayerRef);

  return (
    <div className="flex items-center gap-2">
      <div className="flex min-w-0 flex-1 gap-2">
        <span
          className="text-muted-foreground text-xs"
          style={{ width: `${formatSecondsToHMS(current).length}ch` }}
        >
          {formatSecondsToHMS(current)}
        </span>
        <Slider
          value={[current]}
          min={0}
          max={podcast.duration || 1}
          onValueChange={(value) => onSeek(value, podcast.duration)}
          className="w-full"
          aria-label="Seek"
        />
        <span
          className="text-muted-foreground text-xs"
          style={{ width: `${formatSecondsToHMS(current).length}ch` }}
        >
          {formatSecondsToHMS(podcast.duration)}
        </span>
      </div>
      <Popover>
        <PopoverTrigger>
          <Volume2Icon className="size-4" aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent align="center">
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={onVolume}
            aria-label="Volume"
          />
        </PopoverContent>
      </Popover>

      {podcast.enclosureUrl ? (
        <audio ref={audioPlayerRef} src={podcast.enclosureUrl} preload="none" />
      ) : (
        <div className="sr-only">No audio found.</div>
      )}
    </div>
  );
}