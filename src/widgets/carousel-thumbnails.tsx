"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import type { MutableRefObject } from "react";
import type { Settings } from "react-slick";
import SmartImage from "~/shared/ui/SmartImage";

// Load react-slick on client only to avoid SSR bundling/runtime issues
const Slider = dynamic(() => import("react-slick").then((m) => m.default), {
  ssr: false,
}) as any;

// Type for the Slider component instance methods
type SliderType = {
  slickNext: () => void;
  slickPrev: () => void;
  slickGoTo: (slide: number) => void;
  slickPause: () => void;
  slickPlay: () => void;
  slickCurrentSlide: () => number;
  slickSlideCount: () => number;
  // Add other methods as needed
};

function ThumbnailCarousel({
  thumbnails,
  sliderRef,
  path,
}: {
  path: string;
  thumbnails: string[];
  sliderRef: MutableRefObject<SliderType | null>;
}) {
  const settings: Settings = {
    arrows: false,
    autoplaySpeed: 3000,
    cssEase: "ease-in",
    dots: false,
    fade: true,
    adaptiveHeight: false,
    // Refer: https://github.com/akiran/react-slick/issues/1171
    infinite: thumbnails.length > 1,
    slidesToScroll: 1,
    slidesToShow: 1,
    swipeToSlide: true,
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <Slider ref={sliderRef} className="h-full" {...settings}>
        {thumbnails?.map((thumb) => {
          const match = thumb?.match(/\/vi\/([^\/]+)/);
          const videoId = match?.[1] ?? "";
          const href = videoId ? `${path}#${videoId}` : path;
          return (
            <div key={thumb} className="relative h-full w-full">
              <Link
                className="block h-full w-full"
                prefetch={false}
                scroll={false}
                href={href}
              >
                <SmartImage
                  src={thumb}
                  alt="thumbnail"
                  width={640}
                  height={360}
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  containerClassName="size-full"
                  imageClassName="w-full h-full object-contain"
                />
              </Link>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

export default ThumbnailCarousel;
