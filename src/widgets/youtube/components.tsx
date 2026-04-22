"use client";

import { Clock8, HardDriveDownloadIcon } from "lucide-react";

import { useLiveQuery } from "dexie-react-hooks";
import Linkify from "linkify-react";
import { toast } from "sonner";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import { useIsMobile } from "~/shared/hooks/use-mobile";
import { indexedDB } from "~/shared/lib/api/dexie";
import type { YouTubeCardOptions } from "~/shared/types-schema/types";
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
import { cn } from "~/shared/utils/tailwind-merge";
import { getTimeDifference } from "~/shared/utils/time-diff";

import { OutLink } from "../out-link";
import OverlayTip from "../overlay-tip";

interface WatchLaterProps extends Pick<YouTubeCardOptions, "addWatchLater"> {
  videoData: ZVideoMetadataCompatible;
}

function ChannelMeta({
  hideAvatar,
  video,
}: { video: ZVideoMetadataCompatible } & { hideAvatar: boolean }) {
  const {
    channelLogo,
    videoId,
    channelTitle,
    channelId,
    videoTitle,
    publishedAt,
  } = video;

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
          hideAvatar ? "max-w-full" : "max-w-[calc(100%-32px)]"
        }`}
      >
        <h3
          id={videoId}
          className="text-primary line-clamp-2 pr-6 text-sm leading-normal text-wrap dark:text-white"
        >
          <abbr className="cursor-help no-underline" title={videoTitle}>
            {videoTitle}
          </abbr>
        </h3>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <OutLink
            variant="reset"
            href={`https://youtube.com/channel/${channelId}`}
            target="_blank"
            title={channelTitle}
          >
            {channelTitle}
          </OutLink>
          <b>•</b>
          <span className="text-nowrap">{timeElapsed}</span>
        </div>
      </div>
    </div>
  );
}

function DescriptionSheet({
  videoTitle,
  videoDescription,
}: Pick<ZVideoMetadataCompatible, "videoTitle" | "videoDescription">) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="absolute top-2 right-0.5 cursor-pointer group-hover/player:block md:right-0 md:hidden">
          <OverlayTip
            className="group/description flex place-items-center gap-1 rounded-l-md px-1.25 py-2"
            id="description"
            aria-label="Show video information overlay"
          >
            <div className="hidden text-xs group-hover/description:block">
              Description
            </div>
            <InfoIcon className="size-4 grow" />
          </OverlayTip>
        </div>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto md:max-w-112.5">
        <SheetHeader className="text-left">
          <SheetTitle>{videoTitle}</SheetTitle>
          <SheetDescription className="sr-only">{videoTitle}</SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <Linkify
            className="font-outfit text-sm whitespace-pre-wrap"
            as="pre"
            options={{
              className:
                "cursor-pointer text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70",
              rel: "noopener noreferrer external",
              target: "_blank",
            }}
          >
            {videoDescription}
          </Linkify>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CopyLink({ videoId }: Pick<ZVideoMetadataCompatible, "videoId">) {
  const isMobile = useIsMobile();
  function copyLink(id: string) {
    navigator.clipboard
      .writeText(`https://www.youtube.com/watch?v=${id}`)
      .then(() => {
        toast("Link copied", {
          description: "The video link has been copied to your clipboard.",
        });
      })
      .catch(() => {
        toast("Unable to access clipboard. Please copy manually.");
      });
  }
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex gap-2 justify-start hover:bg-accent rounded-lg p-2 cursor-pointer w-full",
        isMobile ? "text-base" : "text-sm"
      )}
      onClick={() => copyLink(videoId)}
    >
      <LinkIcon className={cn(isMobile ? "size-6" : "size-4")} />
      Copy link
    </Button>
  );
}

function WatchLater({ addWatchLater, videoData }: WatchLaterProps) {
  const isMobile = useIsMobile();
  const existingVideos =
    useLiveQuery(() => indexedDB["watch-later"].toArray()) ?? [];

  async function addToWatchLater() {
    function checkIfExists(
      existingVideos: ZVideoMetadataCompatible[],
      videoId: string
    ) {
      for (let i = 0; i < existingVideos?.length; i++) {
        if (existingVideos[i].videoId === videoId) {
          return true;
        }
      }
      return false;
    }

    if (checkIfExists(existingVideos, videoData.videoId)) {
      toast("Video already added.");
    } else {
      await indexedDB["watch-later"].add(videoData);
      toast(`"${videoData.videoTitle}" added to watch later.`);
    }
  }

  if (addWatchLater) {
    return (
      <Button
        variant="ghost"
        className={cn(
          "flex gap-2 justify-start hover:bg-accent rounded-lg p-2 cursor-pointer w-full",
          isMobile ? "text-base" : "text-sm"
        )}
        onClick={addToWatchLater}
      >
        <Clock8 className={cn(isMobile ? "size-6" : "size-4")} />
        Add to watch later
      </Button>
    );
  }
  return null;
}

function RemoveWatchLater({
  removeWatchLater,
  videoId,
}: Pick<YouTubeCardOptions, "removeWatchLater"> &
  Pick<ZVideoMetadataCompatible, "videoId">) {
  async function removeFromWatchLater(videoId: string) {
    await indexedDB["watch-later"].delete(videoId);
    toast("Video has been removed from watch later.");
  }

  const isMobile = useIsMobile();
  if (removeWatchLater) {
    return (
      <Button
        variant="ghost"
        className={cn(
          "flex gap-2 justify-start hover:bg-accent rounded-lg p-2 cursor-pointer w-full",
          isMobile ? "text-base" : "text-sm"
        )}
        onClick={() => removeFromWatchLater(videoId)}
      >
        <DeleteIcon className={cn(isMobile ? "size-6" : "size-4")} />
        Remove from watch later
      </Button>
    );
  }

  return null;
}

function DownloadVideo({
  disabled = false,
  videoId,
  cobaltYTInstances,
}: {
  disabled?: boolean;
  videoId: string;
  cobaltYTInstances: string[];
}) {
  const isMobile = useIsMobile();
  const target = cobaltYTInstances[0];
  function handleDownload(id: string) {
    if (disabled || !target) {
      toast(
        "Cobalt instances currently unavailable. Please try again after sometime."
      );
      return;
    }

    const videoLink = `https://www.youtube.com/watch?v=${id}`;

    navigator.clipboard.writeText(videoLink);
    toast("Video link has copied to the clipboard.", {
      description: (
        <p>
          Opening a valid{" "}
          <OutLink href={target}>cobalt.tools community instance</OutLink> in a
          new tab. Please paste the video link there.
        </p>
      ),
    });
    setTimeout(() => {
      window.open(target, "_blank", "noopener,noreferrer");
    }, 1500);
  }

  return (
    <Button
      disabled={disabled || !target}
      variant="ghost"
      className={cn(
        "flex gap-2 justify-start hover:bg-accent rounded-lg p-2 cursor-pointer w-full",
        isMobile ? "text-base" : "text-sm",
        disabled && "cursor-not-allowed"
      )}
      onClick={() => handleDownload(videoId)}
    >
      <HardDriveDownloadIcon className={cn(isMobile ? "size-6" : "size-4")} />
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