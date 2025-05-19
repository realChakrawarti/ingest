"use client";

import { EyeIcon, Pause, Play, VideoIcon } from "lucide-react";
import Link from "next/link";
import { MouseEvent, useRef, useState } from "react";
import Slider from "react-slick";

import { cn } from "~/shared/lib/tailwind-merge";
import { ValidMetadata } from "~/shared/types-schema/types";

import ThumbnailCarousel from "./carousel-thumbnails";
import JustTip from "./just-the-tip";
import OverlayTip from "./overlay-tip";

interface DetailsCardProps {
  pageData: ValidMetadata;
  path: string;
}

export default function DetailsCard({ pageData, path }: DetailsCardProps) {
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
        "group flex flex-col gap-0 relative overflow-hidden",
        "rounded-lg border bg-card transition-colors hover:bg-accent"
      )}
    >
      <div className="relative aspect-video">
        {/* TODO: Function components cannot be given refs, consider moving to Next.js 15 which supports React 19 */}
        <ThumbnailCarousel
          path={path}
          sliderRef={sliderRef}
          thumbnails={pageData.thumbnails}
        />

        <div className="absolute right-0 bottom-3">
          {slidesPlaying ? (
            <OverlayTip
              id="slider-play"
              className="px-[5px] py-2 items-center rounded-l-md z-20 cursor-pointer"
            >
              <span onMouseDown={pauseSlides}>
                <Pause className="size-5" />
              </span>
            </OverlayTip>
          ) : (
            <OverlayTip
              id="slider-pause"
              className="px-[5px] py-2 items-center rounded-l-md z-20 cursor-pointer"
            >
              <span onMouseDown={playSlides}>
                <Play className="size-5" />
              </span>
            </OverlayTip>
          )}
        </div>
      </div>

      <Link
        prefetch={false} // In order to disable automatic updation to not frequently viewed catalogs
        key={pageData?.id}
        href={path}
      >
        <div className="flex justify-between p-4 pt-2">
          <div>
            <h2
              id={pageData?.id}
              className="font-semibold group-hover:text-primary"
            >
              {pageData?.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {pageData?.description}
            </p>
          </div>
        </div>
      </Link>

      {pageData?.pageviews ? <Pageview pageviews={pageData.pageviews} /> : null}
      {pageData?.totalVideos ? (
        <TotalVideos totalVideos={pageData.totalVideos} />
      ) : null}
    </section>
  );
}

function TotalVideos({ totalVideos }: { totalVideos: number }) {
  return (
    <JustTip label="Total videos">
      <OverlayTip
        id="total-videos"
        className="flex gap-1 absolute top-2 left-0 items-center px-[5px] py-2 rounded-r-md z-20"
      >
        <p className="text-xs">{totalVideos}</p>
        <VideoIcon className="size-3" />
      </OverlayTip>
    </JustTip>
  );
}

function Pageview({ pageviews }: { pageviews: number }) {
  if (pageviews !== undefined) {
    return (
      <JustTip label="Unique views">
        <OverlayTip
          id="pageviews"
          className="flex gap-1 px-[5px] py-2 absolute top-2 right-0 items-center rounded-l-md z-20"
        >
          <p className="text-xs">{pageviews}</p>
          <EyeIcon className="size-3" />
        </OverlayTip>
      </JustTip>
    );
  }
  return null;
}
