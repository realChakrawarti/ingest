"use client";

import type { RefObject } from "react";
import {
  DownloadIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  RotateCwIcon,
  Volume2Icon,
} from "lucide-react";

import type { ZFeedPodcastItem } from "~/entities/feeds/models";

import { Button } from "~/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/shared/ui/select";
import { Separator } from "~/shared/ui/separator";
import { Slider } from "~/shared/ui/slider";
import fileDownload from "~/shared/utils/file-download";
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
    forward10,
    backward10,
    changeSpeed,
    playbackRate,
  } = usePodcastPlayer(audioPlayerRef);

  return (
    <>
      <Separator />
      <div className="flex items-center gap-4 px-3">
        <button onClick={backward10} role="button">
          <RotateCcwIcon className="size-4" />
        </button>
        <button
          role="button"
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
        </button>
        <button onClick={forward10} role="button">
          <RotateCwIcon className="size-4" />
        </button>
        <div className="flex min-w-0 flex-1 gap-2">
          <span className="text-muted-foreground w-[8ch] text-xs">
            {formatSecondsToHMS(current)}
          </span>
          <Slider
            showThumb={false}
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
              showThumb
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
          <audio
            ref={audioPlayerRef}
            src={podcast.enclosureUrl}
            preload="none"
          />
        ) : (
          <div className="sr-only">No audio found.</div>
        )}
      </div>
      <Separator />
      <div className="flex items-center justify-between px-3 py-1">
        <Select
          value={playbackRate.toString() ?? "1"}
          onValueChange={(value) => changeSpeed(Number(value))}
        >
          <SelectTrigger className="w-auto gap-3">
            <div className="flex items-center gap-1">
              Playback: <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Playback Speed</SelectLabel>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="1.75">1.75x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          variant="link"
          onClick={() => fileDownload(podcast.enclosureUrl, podcast.title)}
        >
          <DownloadIcon className="size-4" />
          <p className="text-sm">
            {(podcast.enclosureLength / 1_000_000).toFixed(2)} MB
          </p>
        </Button>
      </div>
    </>
  );
}