import dynamic from "next/dynamic";

import { cn } from "~/shared/lib/tailwind-merge";
import { YouTubeCardProps } from "~/shared/types-schema/types";

import { ChannelMeta, DescriptionSheet } from "./components";
import ShowCardOption from "./show-card-options";
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
  } = options ?? {};

  return (
    <div className="flex flex-col gap-3 group/player">
      <div key={videoId} className="relative overflow-hidden">
        <div
          className={cn(
            "relative aspect-video overflow-hidden rounded-lg",
            "group-hover/player:border-2 group-hover/player:border-primary"
          )}
        >
          <ClientYouTubePlayer enableJsApi={enableJsApi} {...video} />
          <DescriptionSheet title={title} description={description} />
          <WatchedStatus videoId={video.videoId} />
        </div>
        <ShowCardOption
          video={video}
          addWatchLater={addWatchLater}
          removeWatchLater={removeWatchLater}
        />
        <div className="p-3">
          <ChannelMeta hideAvatar={hideAvatar} {...video} />
        </div>
      </div>
    </div>
  );
}
