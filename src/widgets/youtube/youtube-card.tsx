"use client";

import dynamic from "next/dynamic";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import type { YouTubeCardOptions } from "~/shared/types-schema/types";
import { cn } from "~/shared/utils/tailwind-merge";

import { ChannelMeta, DescriptionSheet } from "./components";
import FocusDialog from "./focus-dialog";
import ShowCardOption from "./show-card-options";
import { VideoCategory } from "./video-category";
import { VideoDuration } from "./video-duration";
import VideoStats from "./video-stats";
import { WatchedStatus } from "./watched-status";

const ClientYouTubePlayer = dynamic(() => import("./player"), {
  ssr: false,
});

interface YouTubeCardProps {
  video: ZVideoMetadataCompatible;
  options?: Partial<YouTubeCardOptions>;
}

export default function YouTubeCard(props: YouTubeCardProps) {
  const { video, options } = props;
  const { videoId, videoTitle, videoDescription } = video;

  const {
    enableJsApi = false,
    hideAvatar = false,
    addWatchLater = false,
    removeWatchLater = false,
    markWatched = false,
    showVideoStats = false,
    showDuration = false,
    showVideoCategory = false,
    focusMode = false,
  } = options ?? {};

  return (
    <div key={videoId} className="group/player grid grid-rows-[1fr_1fr_80px]">
      <div
        className={cn(
          "row-span-2 flex flex-col shrink",
          "rounded-md overflow-hidden",
          "mx-0.5 md:mx-0 group-hover/player:shadow-primary group-hover/player:shadow-[0_0_0_2px]"
        )}
      >
        <div className="relative aspect-video">
          <ClientYouTubePlayer enableJsApi={enableJsApi} {...video} />
          {focusMode ? <FocusDialog enableJsApi video={video} /> : null}
          <DescriptionSheet
            videoTitle={videoTitle}
            videoDescription={videoDescription}
          />
          <WatchedStatus videoId={video.videoId} />
          {showVideoCategory ? (
            <VideoCategory
              publishedAt={video.publishedAt}
              videoId={video.videoId}
              videoComments={video.videoComments ?? 0}
              videoLikes={video.videoLikes ?? 0}
              videoViews={video.videoViews ?? 0}
            />
          ) : null}
        </div>
        <div
          className={cn(
            "flex justify-between items-end",
            "h-11 px-2 py-3 backdrop-blur-xs rounded-b-md",
            "bg-primary/60 text-white/90 text-sm"
          )}
        >
          {showVideoStats ? (
            <VideoStats
              videoId={video.videoId}
              videoComments={video.videoComments ?? 0}
              videoLikes={video.videoLikes ?? 0}
              videoViews={video.videoViews ?? 0}
            />
          ) : null}
          {showDuration ? (
            <VideoDuration
              videoAvailability={video.videoAvailability}
              videoDuration={video?.videoDuration ?? 0}
            />
          ) : null}
        </div>
      </div>
      {/*Description*/}
      <div>
        <ShowCardOption
          video={video}
          addWatchLater={addWatchLater}
          removeWatchLater={removeWatchLater}
          markWatched={markWatched}
        />
        <div className="p-3">
          <ChannelMeta hideAvatar={hideAvatar} video={video} />
        </div>
      </div>
    </div>
  );
}