"use client";

import { EyeIcon, Pause, Play, VideoIcon } from "lucide-react";
import Link from "next/link";
import { type MouseEvent, useRef, useState } from "react";
import type Slider from "react-slick";

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
        "rounded-lg hover:bg-primary/10 bg-primary/5 transition-colors"
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
              className="grid size-8 rounded-l-md z-20 cursor-pointer"
            >
              <span
                className="grid place-items-center size-full"
                onMouseDown={pauseSlides}
              >
                <Pause className="size-5" />
              </span>
            </OverlayTip>
          ) : (
            <OverlayTip
              id="slider-pause"
              className="size-8 rounded-l-md z-20 cursor-pointer"
            >
              <span
                className="grid place-items-center size-full"
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
              className="font-semibold group-hover:text-primary tracking-wide"
            >
              {validData?.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {validData?.description}
            </p>
          </div>
        </div>
      </Link>

      {validData?.pageviews ? (
        <Pageview pageviews={validData.pageviews} />
      ) : null}
      {validData?.totalVideos ? (
        <TotalVideos totalVideos={validData.totalVideos} />
      ) : null}
    </section>
  );
}

function TotalVideos({ totalVideos }: { totalVideos: number }) {
  return (
    <OverlayTip
      id="total-videos"
      className="flex gap-1 absolute top-2 left-0 items-center px-[5px] py-2 rounded-r-md z-20"
    >
      <p className="text-xs">{totalVideos}</p>
      <VideoIcon className="size-3" />
    </OverlayTip>
  );
}

function Pageview({ pageviews }: { pageviews: number }) {
  if (pageviews !== undefined) {
    return (
      <OverlayTip
        id="pageviews"
        className="flex gap-1 px-[5px] py-2 absolute top-2 right-0 items-center rounded-l-md z-20"
      >
        <p className="text-xs">{pageviews}</p>
        <EyeIcon className="size-3" />
      </OverlayTip>
    );
  }
  return null;
}
