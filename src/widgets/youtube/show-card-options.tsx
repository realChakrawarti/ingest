"use client";

import { useState } from "react";

import type { VideoData, YouTubeCardOptions } from "~/shared/types-schema/types";
import { Button } from "~/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui/popover";

import { ThreeDotIcon } from "../../shared/ui/icons";
import {
  CopyLink,
  DownloadVideo,
  RemoveWatchLater,
  WatchLater,
} from "./components";

export default function ShowCardOption({
  addWatchLater,
  removeWatchLater,
  video,
}: Pick<YouTubeCardOptions, "addWatchLater" | "removeWatchLater"> & {
  video: VideoData;
}) {
  const [isOpen, setIsOpen] = useState(false);

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
          <CopyLink videoId={video.videoId} />
          <WatchLater addWatchLater={addWatchLater} videoData={video} />
          <RemoveWatchLater
            videoId={video.videoId}
            removeWatchLater={removeWatchLater}
          />
          <DownloadVideo videoId={video.videoId} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
