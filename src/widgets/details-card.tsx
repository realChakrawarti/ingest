"use client";

import type Slider from "react-slick";

import { type MouseEvent, useRef, useState } from "react";
import Link from "next/link";
import { EyeIcon, File, Pause, Play, VideoIcon } from "lucide-react";

import type { ZArchiveValid } from "~/entities/archives/models";
import type { ZCatalogValid } from "~/entities/catalogs/models";

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
        {/* TODO: Function components cannot be given refs, consider moving to Next.js 15 which supports React 19 */}
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
        <div className="group flex justify-between p-4 pt-2">
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
        </div>
      </Link>

      {validData?.pageviews ? (
        <Pageview pageviews={validData.pageviews} />
      ) : null}
      <div className="absolute top-2 left-0 z-20 flex flex-col gap-2">
        {validData?.totalVideos ? (
          <TotalVideos totalVideos={validData.totalVideos} />
        ) : null}
        {validData?.totalPosts ? (
          <TotalPosts totalPosts={validData.totalPosts} />
        ) : null}
      </div>
    </section>
  );
}

function TotalVideos({ totalVideos }: { totalVideos: number }) {
  return (
    <OverlayTip
      id="total-videos"
      className="flex items-center gap-1 rounded-r-md px-1.25 py-2"
    >
      <p className="text-xs">{totalVideos}</p>
      <VideoIcon className="size-3" />
    </OverlayTip>
  );
}

function TotalPosts({ totalPosts }: { totalPosts: number }) {
  return (
    <OverlayTip
      id="total-posts"
      className="flex items-center gap-1 rounded-r-md px-1.25 py-2"
    >
      <p className="text-xs">{totalPosts}</p>
      <File className="size-3" />
    </OverlayTip>
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