import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import type { YouTubeCardOptions } from "~/shared/types-schema/types";
import { Button } from "~/shared/ui/button";
import SmartImage from "~/widgets/smart-image";
import { DeleteIcon, ThreeDotIcon } from "~/shared/ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui/popover";

import { ChannelMeta } from "~/widgets/youtube/components";

function RemoveVideo({
  removeVideo,
  videoId,
}: Pick<ZVideoMetadataCompatible, "videoId"> &
  Pick<YouTubeCardOptions, "removeVideo">) {
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
  video: ZVideoMetadataCompatible;
  removeVideo: (_videoId: string) => Promise<void>;
}

export default function VideoCard({ video, removeVideo }: VideoCardProps) {
  const { videoId, videoTitle, videoThumbnail } = video;

  return (
    <div className="flex flex-col gap-3">
      <div key={videoId} className="relative overflow-hidden rounded-lg">
        <div className="relative aspect-video overflow-hidden">
          <SmartImage
            src={videoThumbnail}
            alt={videoTitle}
            priority
            containerClassName="w-full h-full"
            imageClassName="w-full h-full object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
            fill
          />
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
          <ChannelMeta video={video} hideAvatar />
        </div>
      </div>
    </div>
  );
}
