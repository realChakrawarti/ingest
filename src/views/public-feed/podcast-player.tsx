"use client";

import type { RefObject } from "react";
import { PauseIcon, PlayIcon, Volume2Icon } from "lucide-react";

import type { ZFeedPodcastItem } from "~/entities/feeds/models";

import { Button } from "~/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui/popover";
import { Slider } from "~/shared/ui/slider";
import formatSecondsToHMS from "~/shared/utils/format-seconds-HMS";

import Spinner from "~/widgets/spinner";

import { usePodcastPlayer } from "./use-podcast-player";

export function PodcastPlayer({
  podcast,
  audioPlayerRef,
}: {
  podcast: ZFeedPodcastItem;
  audioPlayerRef: RefObject<HTMLAudioElement | null>;
}) {
  const {
    current,
    onSeek,
    volume,
    onVolume,
    isPlaying,
    isBuffering,
    togglePlay,
  } = usePodcastPlayer(audioPlayerRef);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        <div className="">
          {isBuffering ? (
            <Spinner className="size-4" />
          ) : isPlaying ? (
            <PauseIcon className="size-4" />
          ) : (
            <PlayIcon className="size-4" />
          )}
        </div>
      </Button>
      <div className="flex min-w-0 flex-1 gap-2">
        <span className="text-muted-foreground w-[8ch] text-xs">
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
        <span className="text-muted-foreground w-[8ch] text-xs">
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