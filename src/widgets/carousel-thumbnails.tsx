"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useImperativeHandle, useRef } from "react";
import type { MutableRefObject } from "react";
import type { Settings } from "react-slick";
import SmartImage from "~/widgets/smart-image";

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
  // Add other methods as needed
};

function ThumbnailCarousel({
  thumbnails,
  sliderRef,
  path,
  title,
  playing = false,
}: {
  path: string;
  thumbnails: string[];
  sliderRef: MutableRefObject<SliderType | null>;
  title?: string;
  playing?: boolean;
}) {
  const internalSliderRef = useRef<any>(null);
  const currentIndexRef = useRef<number>(0);

  // Expose a stable imperative API regardless of dynamic() ref forwarding
  useImperativeHandle(sliderRef, () => ({
    slickNext: () => internalSliderRef.current?.slickNext?.(),
    slickPrev: () => internalSliderRef.current?.slickPrev?.(),
    slickGoTo: (index: number) => internalSliderRef.current?.slickGoTo?.(index),
    slickPause: () => internalSliderRef.current?.slickPause?.(),
    slickPlay: () => internalSliderRef.current?.slickPlay?.(),
  }));

  const settings: Settings = {
    arrows: false,
    autoplay: playing,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    pauseOnDotsHover: false,
    cssEase: "ease-in",
    dots: false,
    fade: true,
    adaptiveHeight: false,
    // Refer: https://github.com/akiran/react-slick/issues/1171
    infinite: thumbnails.length > 1,
    slidesToScroll: 1,
    slidesToShow: 1,
    swipeToSlide: true,
    initialSlide: currentIndexRef.current,
    beforeChange: (_: number, next: number) => {
      currentIndexRef.current = next;
    },
    afterChange: (current: number) => {
      currentIndexRef.current = current;
    },
  };

  // React to external play/pause control once the slider instance exists
  useEffect(() => {
    const inst = internalSliderRef.current;
    if (!inst) return;
    if (playing) {
      inst.slickPlay?.();
    } else {
      inst.slickPause?.();
    }
  }, [playing]);

  // When toggling playing, reinitialize slider to apply autoplay without resetting index
  useEffect(() => {
    const inst = internalSliderRef.current;
    if (!inst) return;
    if (playing) {
      inst.slickPlay?.();
    } else {
      // Pause and pin to current index
      const current = inst.innerSlider?.state?.currentSlide ?? currentIndexRef.current ?? 0;
      currentIndexRef.current = current;
      inst.slickPause?.();
      inst.slickGoTo?.(current, true);
    }
  }, [playing]);

  return (
    <div className="h-full w-full overflow-hidden">
      <Slider
        key={playing ? `on-${currentIndexRef.current}` : `off-${currentIndexRef.current}`}
        ref={internalSliderRef}
        className="h-full"
        {...settings}
      >
        {thumbnails?.map((thumb) => {
          const match = thumb?.match(/\/vi\/([^/]+)/);
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
                  alt={title ? `Thumbnail for ${title}` : "Video thumbnail"}
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
