"use client";

import Link from "next/link";
import { EyeIcon, File, Podcast, VideoIcon } from "lucide-react";

import type { ZFeedValid } from "~/entities/feeds/models";
import type { ZPickValid } from "~/entities/picks/models";

import { useLocalUserSettings } from "~/shared/hooks/use-local-user-settings";
import { Separator } from "~/shared/ui/separator";
import { cn } from "~/shared/utils/tailwind-merge";

import OverlayTip from "./overlay-tip";

interface DetailsCardProps {
  validData: ZFeedValid | ZPickValid;
  path: string;
}

export default function DetailsCard({ validData, path }: DetailsCardProps) {
  const { localUserSettings } = useLocalUserSettings(null);

  return (
    <section
      className={cn(
        "border-none",
        "flex flex-col gap-0 relative overflow-hidden",
        "rounded-lg hover:bg-primary/10 bg-primary/5 transition-colors hover-lift"
      )}
    >
      <div className="relative aspect-video">
        {validData?.thumbnails?.length >= 4 ? (
          <Link prefetch={false} scroll={false} href={path}>
            <div className="grid grid-cols-2 grid-rows-2">
              {validData.thumbnails.slice(0, 4).map((thumb, index) => (
                <img
                  style={{
                    filter: `grayscale(${localUserSettings?.thumbnailGrayscale ?? 0}%)`,
                  }}
                  key={index}
                  className="size-full object-contain"
                  src={thumb}
                  alt="thumbnail"
                />
              ))}
            </div>
          </Link>
        ) : (
          <img
            className="size-full object-contain"
            src={validData.thumbnails[0]}
            alt="thumbnail"
          />
        )}
      </div>

      <Link
        prefetch={false} // In order to disable automatic updation to not frequently viewed feeds
        key={validData?.id}
        href={path}
      >
        <div className="group flex flex-col justify-between gap-3 p-4 pt-2">
          <div>
            <h2
              id={validData?.id}
              className="group-hover:text-primary tracking-wide"
            >
              {validData?.title}
            </h2>
            <p className="text-muted-foreground text-sm">
              {validData?.description}
            </p>
          </div>
          <Separator />
          <div className="text-muted-foreground flex gap-2 text-sm">
            <div className="flex items-center gap-1">
              <VideoIcon className="size-4" />
              <span>{validData.totalVideos} videos</span>
            </div>
            {validData?.totalPosts ? (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <File className="size-4" />
                  <span>{validData.totalPosts} posts</span>
                </div>
              </>
            ) : null}
            {validData.totalPodcasts ? (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Podcast className="size-4" />
                  <span>{validData.totalPodcasts} podcasts</span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </Link>

      {validData?.pageviews ? (
        <Pageview pageviews={validData.pageviews} />
      ) : null}
    </section>
  );
}

function Pageview({ pageviews }: { pageviews: number }) {
  if (pageviews !== undefined) {
    return (
      <OverlayTip
        id="pageviews"
        className="absolute top-2 right-0 z-20 flex items-center gap-1 rounded-l-md px-1.25 py-2"
      >
        <p className="text-xs">{pageviews}</p>
        <EyeIcon className="size-3" />
      </OverlayTip>
    );
  }
  return null;
}