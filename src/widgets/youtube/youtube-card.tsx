import dynamic from "next/dynamic";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import type { YouTubeCardOptions } from "~/shared/types-schema/types";

import { ChannelMeta, DescriptionSheet } from "./components";
import ShowCardOption from "./show-card-options";
import { TimeDuration } from "./time-duration";
import { VideoCategory } from "./video-category";
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
  } = options ?? {};

  return (
    <div key={videoId} id="player-card" className="flex flex-col group/player">
      <div className="relative aspect-video">
        <ClientYouTubePlayer enableJsApi={enableJsApi} {...video} />
        <DescriptionSheet
          videoTitle={videoTitle}
          videoDescription={videoDescription}
        />
        <WatchedStatus videoId={video.videoId} />
        {showVideoCategory ? (
          <VideoCategory
            videoId={video.videoId}
            videoComments={video.videoComments ?? 0}
            videoLikes={video.videoLikes ?? 0}
            videoViews={video.videoViews ?? 0}
          />
        ) : null}
        {showVideoStats ? (
          <VideoStats
            videoId={video.videoId}
            videoComments={video.videoComments ?? 0}
            videoLikes={video.videoLikes ?? 0}
            videoViews={video.videoViews ?? 0}
          />
        ) : null}
        {showDuration ? (
          <TimeDuration
            videoDuration={video?.videoDuration ?? 0}
            videoId={video.videoId}
          />
        ) : null}
      </div>
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
  );
}
