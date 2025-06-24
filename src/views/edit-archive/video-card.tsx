import type { VideoDetails } from "~/entities/youtube/models";

import type {
  VideoData,
  YouTubeCardOptions,
} from "~/shared/types-schema/types";
import { Button } from "~/shared/ui/button";
import { DeleteIcon, ThreeDotIcon } from "~/shared/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui/popover";

import { ChannelMeta } from "~/widgets/youtube/components";

function RemoveVideo({
  removeVideo,
  videoId,
}: Pick<VideoData, "videoId"> & Pick<YouTubeCardOptions, "removeVideo">) {
  if (typeof removeVideo === "function")
    return (
      <Button
        variant="ghost"
        className="flex gap-2 justify-start hover:bg-accent rounded-lg p-2 text-xs cursor-pointer w-full"
        onClick={() => removeVideo(videoId)}
      >
        <DeleteIcon className="h-4 w-4 mr-2" />
        Remove video
      </Button>
    );
  return null;
}

interface VideoCardProps {
  video: VideoDetails;
  removeVideo: (_videoId: string) => Promise<void>;
}

export default function VideoCard({ video, removeVideo }: VideoCardProps) {
  const {
    videoId,
    videoTitle,
    videoThumbnail,
    channelTitle,
    channelId,
    publishedAt,
  } = video;

  return (
    <div className="flex flex-col gap-3">
      <div key={videoId} className="relative overflow-hidden rounded-lg">
        <div className="relative aspect-video overflow-hidden">
          <img src={videoThumbnail} alt={videoTitle} />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-0 h-6 w-6"
              >
                <ThreeDotIcon className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            className="w-[200px] border-none rounded-lg p-1"
          >
            <RemoveVideo videoId={videoId} removeVideo={removeVideo} />
          </PopoverContent>
        </Popover>
        <div className="p-3">
          <ChannelMeta
            hideAvatar
            channelTitle={channelTitle}
            channelLogo=""
            channelId={channelId}
            title={videoTitle}
            publishedAt={publishedAt}
            videoId={videoId}
          />
        </div>
      </div>
    </div>
  );
}
