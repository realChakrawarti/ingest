"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import type { MutableRefObject } from "react";
import type { Settings } from "react-slick";
import SmartImage from "~/shared/ui/SmartImage";

// Load react-slick on client only to avoid SSR bundling/runtime issues
const Slider = dynamic(() => import("react-slick").then((m) => m.default), {
  ssr: false,
});

function ThumbnailCarousel({
  thumbnails,
  sliderRef,
  path,
}: {
  path: string;
  thumbnails: string[];
  sliderRef: MutableRefObject<any>;
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
      <Slider className="h-full" {...settings}>
        {thumbnails?.map((thumb) => {
          const videoId = thumb?.split("/vi/")[1].split("/")[0];
          return (
            <div key={thumb} className="relative h-full w-full">
              <Link
                className="block h-full w-full"
                prefetch={false}
                scroll={false}
                href={`${path}#${videoId}`}
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
