"use client";

import { useState } from "react";
import useSWR from "swr";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import type { YouTubeCardOptions } from "~/shared/types-schema/types";
import { Button } from "~/shared/ui/button";
import { ThreeDotIcon } from "~/shared/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui/popover";

import {
  CopyLink,
  DownloadVideo,
  RemoveWatchLater,
  WatchLater,
} from "./components";
import MarkedWatched from "./marked-watched";

type CobaltInstances = {
  youtube: string[];
  facebook: string[];
  rutube: string[];
  bluesky: string[];
  tumblr: string[];
  "youtube-music": string[];
  bilibili: string[];
  pinterest: string[];
  instagram: string[];
  soundcloud: string[];
  odnoklassniki: string[];
  dailymotion: string[];
  snapchat: string[];
  "youtube-shorts": string[];
  twitter: string[];
  loom: string[];
  vimeo: string[];
  xiaohongshu: string[];
  "twitch-clips": string[];
  vk: string[];
  streamable: string[];
  tiktok: string[];
  reddit: string[];
  newgrounds: string[];
};

export default function ShowCardOption({
  addWatchLater,
  removeWatchLater,
  markWatched,
  video,
}: Pick<
  YouTubeCardOptions,
  "addWatchLater" | "removeWatchLater" | "markWatched"
> & {
  video: ZVideoMetadataCompatible;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: cobaltYTInstances } = useSWR(
    "https://cobalt.directory/api_frontends.json",
    (url) => fetch(url).then((res) => res.json() as Promise<CobaltInstances>),
    {
      errorRetryCount: 0,
      refreshInterval: 5 * 60 * 1000, // 5 minutes
      revalidateOnFocus: false,
    }
  );

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-0 h-6 w-6"
          >
            <ThreeDotIcon className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          onClick={() => setIsOpen(false)}
          side="top"
          align="end"
          className="w-[200px] border-none rounded-lg p-1"
        >
          {markWatched && video?.videoAvailability === "none" ? (
            <MarkedWatched video={video} />
          ) : null}
          <CopyLink videoId={video.videoId} />
          <WatchLater addWatchLater={addWatchLater} videoData={video} />
          <RemoveWatchLater
            videoId={video.videoId}
            removeWatchLater={removeWatchLater}
          />
          {video?.videoAvailability === "none" ? (
            <DownloadVideo
              disabled={!cobaltYTInstances?.youtube?.length}
              cobaltYTInstances={cobaltYTInstances?.youtube ?? []}
              videoId={video.videoId}
            />
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
}
