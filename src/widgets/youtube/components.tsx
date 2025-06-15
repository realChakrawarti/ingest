import { useLiveQuery } from "dexie-react-hooks";
import Linkify from "linkify-react";
import { Clock8, HardDriveDownloadIcon } from "lucide-react";
import { Inter } from "next/font/google";

import { toast } from "~/shared/hooks/use-toast";
import { indexedDB } from "~/shared/lib/api/dexie";
import { getTimeDifference } from "~/shared/lib/date-time/time-diff";
import { VideoData, YouTubeCardOptions } from "~/shared/types-schema/types";
import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";
import { Button } from "~/shared/ui/button";
import { DeleteIcon, InfoIcon, LinkIcon } from "~/shared/ui/icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/shared/ui/sheet";

import { OutLink } from "../out-link";
import OverlayTip from "../overlay-tip";

interface WatchLaterProps extends Pick<YouTubeCardOptions, "addWatchLater"> {
  videoData: VideoData;
}

const inter = Inter({ subsets: ["latin"] });

function ChannelMeta({
  channelLogo,
  channelTitle,
  channelId,
  title,
  publishedAt,
  hideAvatar,
  videoId,
}: Omit<VideoData, "description"> & { hideAvatar: boolean }) {
  const [_, timeElapsed] = getTimeDifference(publishedAt, true, false);
  return (
    <div className="flex gap-3">
      {channelLogo && !hideAvatar ? (
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={channelLogo} alt={channelTitle} />
          <AvatarFallback>{channelTitle}</AvatarFallback>
        </Avatar>
      ) : null}
      <div
        className={`flex-1 space-y-1 ${
          hideAvatar ? "max-w-[100%]" : "max-w-[calc(100%-32px)]"
        }`}
      >
        <h3
          id={videoId}
          className="font-semibold leading-tight text-sm line-clamp-2 pr-6 text-wrap group-hover/player:text-primary"
        >
          <abbr className="no-underline cursor-help" title={title}>
            {title}
          </abbr>
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <OutLink
            className="hover:underline text-nowrap overflow-hidden"
            href={`https://youtube.com/channel/${channelId}`}
            target="_blank"
          >
            <abbr className="no-underline cursor-pointer" title={channelTitle}>
              {channelTitle}
            </abbr>
          </OutLink>
          <b>•</b>
          <span className="text-nowrap">{timeElapsed}</span>
        </div>
      </div>
    </div>
  );
}

function DescriptionSheet({
  title,
  description,
}: Pick<VideoData, "title" | "description">) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="absolute top-2 right-[2px] md:right-0 cursor-pointer md:hidden group-hover/player:block">
          <OverlayTip
            className="px-[5px] py-2 flex gap-1 place-items-center rounded-l-md group/description"
            id="description"
            aria-label="Show video information overlay"
          >
            <div className="hidden text-xs group-hover/description:block">
              Description
            </div>
            <InfoIcon className="size-4 flex-grow" />
          </OverlayTip>
        </div>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-full md:max-w-[450px]">
        <SheetHeader className="text-left">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className="sr-only">{title}</SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Linkify
            className={`text-xs whitespace-pre-wrap ${inter.className}`}
            as="pre"
            options={{
              className:
                "cursor-pointer text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70",
              rel: "noopener noreferrer external",
              target: "_blank",
            }}
          >
            {description}
          </Linkify>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CopyLink({ videoId }: Pick<VideoData, "videoId">) {
  function copyLink(id: string) {
    navigator.clipboard
      .writeText(`https://www.youtube.com/watch?v=${id}`)
      .then(() => {
        toast({
          title: "Link copied",
          description: "The video link has been copied to your clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Unable to access clipboard. Please copy manually.",
        });
      });
  }
  return (
    <Button
      variant="ghost"
      className="flex gap-2 justify-start hover:bg-accent rounded-lg p-2 text-xs cursor-pointer w-full"
      onClick={() => copyLink(videoId)}
    >
      <LinkIcon className="h-4 w-4 mr-2" />
      Copy link
    </Button>
  );
}

function WatchLater({ addWatchLater, videoData }: WatchLaterProps) {
  const existingVideos =
    useLiveQuery(() => indexedDB["watch-later"].toArray()) ?? [];

  async function addToWatchLater() {
    function checkIfExists(existingVideos: VideoData[], videoId: string) {
      for (let i = 0; i < existingVideos?.length; i++) {
        if (existingVideos[i].videoId === videoId) {
          return true;
        }
      }
      return false;
    }

    if (checkIfExists(existingVideos, videoData.videoId)) {
      toast({ title: "Video already added." });
    } else {
      await indexedDB["watch-later"].add(videoData);
      toast({ title: `"${videoData.title}" added to watch later.` });
    }
  }

  if (addWatchLater) {
    return (
      <Button
        variant="ghost"
        className="flex gap-2 justify-start hover:bg-accent rounded-lg p-2 text-xs cursor-pointer w-full"
        onClick={addToWatchLater}
      >
        <Clock8 className="h-4 w-4 mr-2" />
        Add to watch later
      </Button>
    );
  }
  return null;
}

function RemoveWatchLater({
  removeWatchLater,
  videoId,
}: Pick<YouTubeCardOptions, "removeWatchLater"> & Pick<VideoData, "videoId">) {
  async function removeFromWatchLater(videoId: string) {
    await indexedDB["watch-later"].delete(videoId);
    toast({ title: "Video has been removed from watch later." });
  }

  if (removeWatchLater) {
    return (
      <Button
        variant="ghost"
        className="flex gap-2 justify-start hover:bg-accent rounded-lg p-2 text-xs cursor-pointer w-full"
        onClick={() => removeFromWatchLater(videoId)}
      >
        <DeleteIcon className="h-4 w-4 mr-2" />
        Remove from watch later
      </Button>
    );
  }

  return null;
}

function DownloadVideo({ videoId }: { videoId: string }) {
  function handleDownload(id: string) {
    const videoLink = `https://www.youtube.com/watch?v=${id}`;

    navigator.clipboard.writeText(videoLink);
    toast({
      title: "Video link has copied to the clipboard.",
      description: (
        <p>
          Opening{" "}
          <OutLink
            className="cursor-pointer text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70"
            href="https://cobalt.tools"
          >
            cobalt.tools
          </OutLink>{" "}
          in a new tab. Please paste the video link.
        </p>
      ),
    });
    setTimeout(() => {
      window.open("https://cobalt.tools", "_blank");
    }, 1500);
  }

  return (
    <Button
      variant="ghost"
      className="flex gap-2 justify-start hover:bg-accent rounded-lg p-2 text-xs cursor-pointer w-full"
      onClick={() => handleDownload(videoId)}
    >
      <HardDriveDownloadIcon className="h-4 w-4 mr-2" />
      Download via Cobalt
    </Button>
  );
}

export {
  ChannelMeta,
  CopyLink,
  DescriptionSheet,
  DownloadVideo,
  RemoveWatchLater,
  WatchLater,
};
