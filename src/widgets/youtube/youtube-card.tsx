import dynamic from "next/dynamic";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import type { YouTubeCardOptions } from "~/shared/types-schema/types";

import { ChannelMeta, DescriptionSheet } from "./components";
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

async function getCobaltYTInstances() {
  try {
    const result = await fetch("https://cobalt.directory/api_frontends.json");
    const all = (await result.json()) as CobaltInstances;
    return all.youtube;
  } catch (_err) {
    return [];
  }
}

export default async function YouTubeCard(props: YouTubeCardProps) {
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

  const downloadCobaltLinks = await getCobaltYTInstances();

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
            publishedAt={video.publishedAt}
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
          <VideoDuration
            videoAvailability={video.videoAvailability}
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
        cobaltYTInstances={downloadCobaltLinks}
      />
      <div className="p-3">
        <ChannelMeta hideAvatar={hideAvatar} video={video} />
      </div>
    </div>
  );
}
