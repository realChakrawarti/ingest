"use client";

import {
  Ban,
  Book,
  LayoutGrid,
  Moon,
  RefreshCw,
  Share2,
  Shield,
  Smartphone,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "~/shared/utils/tailwind-merge";

const features = [
  {
    description:
      "Create custom catalogs for your favorite channels, playlists and subreddits tailored to your interests.",
    icon: <Book className="h-5 w-5" />,
    title: "Personalized Catalogs",
  },
  {
    description:
      "Stay up-to-date with the latest videos and posts from your channels and subreddits, automatically updated every 4 hours.",
    icon: <RefreshCw className="h-5 w-5" />,
    title: "Automated Updates",
  },
  {
    description:
      "A clean and user-friendly design makes it easy to navigate and find the videos and posts you want.",
    icon: <LayoutGrid className="h-5 w-5" />,
    title: "Simple and Intuitive Interface",
  },
  {
    description:
      "Share your curated catalogs with friends and family, making it easy to discover new content together.",
    icon: <Share2 className="h-5 w-5" />,
    title: "Shareable Catalogs",
  },
  {
    description:
      "Enjoy a seamless viewing experience without interruptions from ads.",
    icon: <Ban className="h-5 w-5" />,
    title: "Ad-Free Experience",
  },
  {
    description:
      "Reduce eye strain and enhance your viewing experience with dark mode.",
    icon: <Moon className="h-5 w-5" />,
    title: "Dark Mode",
  },
  {
    description:
      "Access your curated catalogs on your smartphone or tablet, anytime, anywhere.",
    icon: <Smartphone className="h-5 w-5" />,
    title: "Mobile-Friendly",
  },
  {
    description:
      "Your data privacy is our top priority. Your viewing data never leaves your device.",
    icon: <Shield className="h-5 w-5" />,
    title: "Offline Privacy-Focused",
  },
];

export default function FeatureCarousel() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Duplicate features for seamless loop
  const duplicatedFeatures = [...features, ...features];

  // Auto-scroll functionality
  useEffect(() => {
    if (!carouselRef.current || isPaused) return;

    const startScrolling = () => {
      scrollIntervalRef.current = setInterval(() => {
        if (carouselRef.current && !isPaused) {
          const scrollAmount = 1;
          carouselRef.current.scrollLeft += scrollAmount;

          // Reset to beginning when we've scrolled past the first set
          const maxScroll = carouselRef.current.scrollWidth / 2;
          if (carouselRef.current.scrollLeft >= maxScroll) {
            carouselRef.current.scrollLeft = 0;
          }
        }
      }, 20);
    };

    startScrolling();

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isPaused]);

  const handleMouseEnter = (index: number) => {
    setIsPaused(true);
    setActiveFeature(index);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    setActiveFeature(null);
  };

  return (
    <div
      className={cn(
        "w-full mx-auto px-1 mt-10 md:mt-3 relative z-10",
        "max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
      )}
    >
      <div className="relative overflow-hidden">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide gap-6 py-4"
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          {duplicatedFeatures.map((feature, idx) => (
            <button
              type="button"
              key={`${feature.title}-${idx}`}
              className={cn(
                "flex-none w-fit rounded-2xl transition-all duration-300 ease-out",
                "border",
                "pl-1 pr-3 py-2 cursor-pointer",
                "animate-fade-in-up",
                activeFeature === idx % features.length &&
                  "ring-2 ring-primary/30 border-primary/50"
              )}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={() => handleMouseEnter(idx % features.length)}
              style={{
                animationDelay: `${(idx % features.length) * 100}ms`,
              }}
            >
              {/* Icon and Title inline */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "rounded-md p-1 transition-all duration-300",
                    activeFeature === idx % features.length
                      ? "animate-pulse-slow"
                      : ""
                  )}
                >
                  <div className="text-primary/80">{feature.icon}</div>
                </div>
                <h3 className="text-sm leading-tight">{feature.title}</h3>
              </div>
            </button>
          ))}
        </div>

        {/* Gradient overlays for seamless scroll effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>

      {/* Description box that appears below the carousel */}
      <div className="mt-3 min-h-[120px] flex items-center justify-center">
        <div className="text-zinc-500 text-center animate-fade-in">
          {activeFeature === null ? (
            <p className="text-sm">Hover over a feature card to learn more</p>
          ) : (
            <p className="text-sm">{features[activeFeature].description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
