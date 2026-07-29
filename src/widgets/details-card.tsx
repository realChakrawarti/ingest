"use client";

import type Slider from "react-slick";

import { type MouseEvent, useRef, useState } from "react";
import Link from "next/link";
import { EyeIcon, File, Pause, Play, Podcast, VideoIcon } from "lucide-react";

import type { ZArchiveValid } from "~/entities/archives/models";
import type { ZCatalogValid } from "~/entities/catalogs/models";

import { Separator } from "~/shared/ui/separator";
import { cn } from "~/shared/utils/tailwind-merge";

import ThumbnailCarousel from "./carousel-thumbnails";
import OverlayTip from "./overlay-tip";

interface DetailsCardProps {
  validData: ZCatalogValid | ZArchiveValid;
  path: string;
}

export default function DetailsCard({ validData, path }: DetailsCardProps) {
  const sliderRef = useRef<Slider | null>(null);
  const [slidesPlaying, setSlidesPlaying] = useState<boolean>(false);

  const playSlides = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSlidesPlaying(true);
    sliderRef.current?.slickPlay();
  };

  const pauseSlides = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSlidesPlaying(false);
    sliderRef.current?.slickPause();
  };

  return (
    <section
      className={cn(
        "border-none",
        "flex flex-col gap-0 relative overflow-hidden",
        "rounded-lg hover:bg-primary/10 bg-primary/5 transition-colors hover-lift"
      )}
    >
      <div className="relative aspect-video">
        <ThumbnailCarousel
          path={path}
          sliderRef={sliderRef}
          thumbnails={validData.thumbnails}
        />

        <div className="absolute right-0 bottom-3">
          {slidesPlaying ? (
            <OverlayTip
              id="slider-play"
              className="z-20 grid size-8 cursor-pointer rounded-l-md"
            >
              <span
                className="grid size-full place-items-center"
                onMouseDown={pauseSlides}
              >
                <Pause className="size-5" />
              </span>
            </OverlayTip>
          ) : (
            <OverlayTip
              id="slider-pause"
              className="z-20 size-8 cursor-pointer rounded-l-md"
            >
              <span
                className="grid size-full place-items-center"
                onMouseDown={playSlides}
              >
                <Play className="size-5" />
              </span>
            </OverlayTip>
          )}
        </div>
      </div>

      <Link
        prefetch={false} // In order to disable automatic updation to not frequently viewed catalogs
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