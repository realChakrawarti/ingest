"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import type { ComponentRef, MutableRefObject } from "react";
import type { Settings } from "react-slick";
import type Slider from "react-slick";
import SmartImage from "~/widgets/smart-image";

// Type for the Slider component instance
type SlickSlider = ComponentRef<typeof Slider>;

// Load react-slick on client only to avoid SSR bundling/runtime issues
const SliderDynamic = dynamic(() => import("react-slick").then((m) => m.default), {
  ssr: false,
}) as typeof Slider;

// Type for the Slider component instance methods
export type SliderType = {
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
  const internalSliderRef = useRef<SlickSlider | null>(null);
  const currentIndexRef = useRef<number>(0);

  // Respect user preference to reduce motion (reactive with SSR-safe initialization)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
  });

  // Listen for changes to reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(e.matches);
    };
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);
    // Listen for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Expose a stable imperative API regardless of dynamic() ref forwarding
  useImperativeHandle(sliderRef, () => ({
    slickNext: () => internalSliderRef.current?.slickNext?.(),
    slickPrev: () => internalSliderRef.current?.slickPrev?.(),
    slickGoTo: (index: number) => internalSliderRef.current?.slickGoTo?.(index),
    slickPause: () => internalSliderRef.current?.slickPause?.(),
    slickPlay: () => internalSliderRef.current?.slickPlay?.(),
  }), []);

  const settings: Settings = {
    arrows: false,
    autoplay: playing && !prefersReducedMotion,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    pauseOnDotsHover: false,
    cssEase: "ease-in",
    dots: false,
    fade: !prefersReducedMotion,
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

  // When toggling playing, reinitialize slider to apply autoplay without resetting index
  useEffect(() => {
        if (prefersReducedMotion) {
         internalSliderRef.current?.slickPause?.();
          return;
        }    
    const inst = internalSliderRef.current;
    if (!inst) return;
    if (playing) {
      inst.slickPlay?.();
    } else {
      // Pause and pin to current index
      const current = currentIndexRef.current ?? 0;
      inst.slickPause?.();
      inst.slickGoTo?.(current, true);
    }
  }, [playing, prefersReducedMotion]);

  return (
    <div className="h-full w-full overflow-hidden">
      <SliderDynamic
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
      </SliderDynamic>
    </div>
  );
}

export default ThumbnailCarousel;
