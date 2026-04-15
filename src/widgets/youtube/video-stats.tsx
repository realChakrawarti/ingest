"use client";

import type { PropsWithChildren } from "react";
import { EyeIcon, MessageSquare, ThumbsUp } from "lucide-react";

import type { ZVideoContentInfo } from "~/entities/catalogs/models";

import formatLargeNumber from "~/shared/utils/format-large-number";

type StatsLabelProps = { title: string } & PropsWithChildren & {
    show: boolean;
  };

function StatsLabel({ title, children, show }: StatsLabelProps) {
  if (!show) return null;

  return (
    <abbr
      className="flex cursor-help items-center gap-1 no-underline"
      title={title}
    >
      {children}
    </abbr>
  );
}

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
  const [formattedViews, formattedLikes, formattedComments] = [
    formatLargeNumber(videoViews),
    formatLargeNumber(videoLikes),
    formatLargeNumber(videoComments),
  ];
  return (
    <div className="flex items-center gap-1">
      <StatsLabel show={Boolean(videoViews)} title={`${formattedViews} views`}>
        <EyeIcon className="size-4" />
        {formattedViews}
      </StatsLabel>
      <StatsLabel show={Boolean(videoLikes)} title={`${formattedLikes} likes`}>
        <ThumbsUp className="size-4" />
        {formattedLikes}
      </StatsLabel>
      <StatsLabel
        show={Boolean(videoComments)}
        title={`${formattedComments} comments`}
      >
        <MessageSquare className="size-4" />
        {formattedComments}
      </StatsLabel>
    </div>
  );
}