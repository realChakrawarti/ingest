"use client";

import { ChartBar, EyeIcon, MessageSquare, ThumbsUp } from "lucide-react";

import type { ZVideoContentInfo } from "~/entities/catalogs/models";

import OverlayTip from "../overlay-tip";
import useActivePlayerRef from "./use-active-player";

function formatNumber(num: number): string {
  const billion = 1_000_000_000;
  const million = 1_000_000;
  const thousand = 1_000;

  if (num >= billion) {
    return `${(num / billion).toFixed(1)}B`;
  } else if (num >= million) {
    return `${(num / million).toFixed(1)}M`;
  } else if (num >= thousand) {
    return `${(num / thousand).toFixed(1)}K`;
  } else {
    return num.toString();
  }
}

export default function VideoStats({
  videoViews,
  videoLikes,
  videoComments,
  videoId,
}: Omit<ZVideoContentInfo, "videoDuration" | "videoAvailability"> & {
  videoId: string;
}) {
  const activePlayerRef = useActivePlayerRef();

  if (activePlayerRef?.getVideoData()?.video_id === videoId) {
    return null;
  }

  return (
    <div className="absolute bottom-2 left-[2px] md:left-0 cursor-default">
      <OverlayTip
        className="px-[5px] py-2 flex gap-1 place-items-center rounded-r-md"
        id="video-category"
        aria-label="Video category"
      >
        <div className="text-xs flex gap-1 items-center">
          <ChartBar className="size-4 block group-hover/player:hidden" />
          <div className="hidden group-hover/player:flex gap-1 items-center">
            <span className="flex items-center gap-1">
              <EyeIcon className="size-4" />
              {formatNumber(videoViews)}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="size-4" />
              {formatNumber(videoLikes)}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="size-4" />
              {formatNumber(videoComments)}
            </span>
          </div>
        </div>
      </OverlayTip>
    </div>
  );
}
