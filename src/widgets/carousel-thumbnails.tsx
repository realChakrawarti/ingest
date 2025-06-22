"use client";

import Link from "next/link";
import type { MutableRefObject } from "react";
import Slider, { type Settings } from "react-slick";

function ThumbnailCarousel({
  thumbnails,
  sliderRef,
  path,
}: {
  path: string;
  thumbnails: string[];
  sliderRef: MutableRefObject<Slider | null>;
}) {
  const settings: Settings = {
    arrows: false,
    autoplaySpeed: 2500,
    cssEase: "linear",
    dots: false,
    // Refer: https://github.com/akiran/react-slick/issues/1171
    infinite: thumbnails.length > 1,
    slidesToScroll: 1,
    slidesToShow: 1,
    swipeToSlide: true,
  };

  return (
    <div className="size-full overflow-hidden">
      <Slider ref={sliderRef} {...settings}>
        {thumbnails?.map((thumb) => {
          const videoId = thumb.split("/vi/")[1].split("/")[0];
          return (
            <div key={thumb}>
              <Link prefetch={false} scroll={false} href={`${path}#${videoId}`}>
                <img
                  className="object-contain size-full"
                  src={thumb}
                  alt="thumbnail"
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
