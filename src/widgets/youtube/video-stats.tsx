"use client";

import { EyeIcon, MessageSquare, ThumbsUp } from "lucide-react";

import type { ZVideoContentInfo } from "~/entities/catalogs/models";

import formatLargeNumber from "~/shared/utils/format-large-number";

export default function VideoStats({
  videoViews,
  videoLikes,
  videoComments,
}: Omit<
  ZVideoContentInfo,
  "videoDuration" | "videoAvailability" | "defaultVideoLanguage"
> & {
  videoId: string;
}) {
  return (
    <div className="cursor-default">
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1">
          <span className="flex items-center gap-1">
            <EyeIcon className="size-4" />
            {formatLargeNumber(videoViews)}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="size-4" />
            {formatLargeNumber(videoLikes)}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="size-4" />
            {formatLargeNumber(videoComments)}
          </span>
        </div>
      </div>
    </div>
  );
}