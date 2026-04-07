"use client";

import type { ZVideoContentInfo } from "~/entities/catalogs/models";
import { EyeIcon, MessageSquare, ThumbsUp } from "lucide-react";
import formatLargeNumber from "~/shared/utils/format-large-number";

export default function VideoStats({
  videoViews,
  videoLikes,
  videoComments,
  videoId,
}: Omit<
  ZVideoContentInfo,
  "videoDuration" | "videoAvailability" | "defaultVideoLanguage"
> & {
  videoId: string;
}) {
  return (
    <div className="cursor-default">
      <div className="flex gap-1 items-center">
        <div className="flex gap-1 items-center">
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
