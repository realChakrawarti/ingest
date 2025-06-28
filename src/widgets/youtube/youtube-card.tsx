import dynamic from "next/dynamic";

import type { YouTubeCardProps } from "~/shared/types-schema/types";

import { ChannelMeta, DescriptionSheet } from "./components";
import ShowCardOption from "./show-card-options";
import { TimeDuration } from "./time-duration";
import { WatchedStatus } from "./watched-status";

const ClientYouTubePlayer = dynamic(() => import("./player"), {
  ssr: false,
});

export default function YouTubeCard(props: YouTubeCardProps) {
  const { video, options } = props;

  const { videoId, title, description } = video;

  const {
    enableJsApi = false,
    hideAvatar = false,
    addWatchLater = false,
    removeWatchLater = false,
    markWatched = false,
  } = options ?? {};

  return (
    <div key={videoId} id="player-card" className="flex flex-col group/player">
      <div className="relative aspect-video">
        <ClientYouTubePlayer enableJsApi={enableJsApi} {...video} />
        <DescriptionSheet title={title} description={description} />
        <WatchedStatus videoId={video.videoId} />
        <TimeDuration
          videoDuration={video?.videoDuration ?? 0}
          videoId={video.videoId}
        />
      </div>
      <ShowCardOption
        video={video}
        addWatchLater={addWatchLater}
        removeWatchLater={removeWatchLater}
        markWatched={markWatched}
      />
      <div className="p-3">
        <ChannelMeta hideAvatar={hideAvatar} {...video} />
      </div>
    </div>
  );
}
