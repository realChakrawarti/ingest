"use client";

import type { ChannelTag } from "./helper-methods";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

import { parseAsString, useQueryState } from "nuqs";

import useScreenWidth from "~/shared/hooks/use-screen-width";
import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";
import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";
import { Label } from "~/shared/ui/label";
import { ToggleGroup, ToggleGroupItem } from "~/shared/ui/toggle-group";
import { cn } from "~/shared/utils/tailwind-merge";
export default function FilterChannel({
  activeChannels,
}: {
  activeChannels: ChannelTag[];
}) {
  const [channelId, setChannelId] = useQueryState(
    "channelId",
    parseAsString
      .withDefault("")
      .withOptions({ history: "replace", shallow: false })
  );

  const handleSelectionChange = (key: string) => {
    if (!key) {
      return;
    }
    return setChannelId(key);
  };

  const handleOnClear = () => {
    setChannelId(null);
  };

  const containerWidth = useScreenWidth();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ behavior: "smooth", left: -200 });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ behavior: "smooth", left: 200 });
    }
  };

  useEffect(() => {
    const checkScrollButtons = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        setShowLeftScroll(scrollLeft > 10);
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollButtons);

      // Initial check after content loads
      setTimeout(checkScrollButtons, 100);

      return () => {
        scrollContainer.removeEventListener("scroll", checkScrollButtons);
      };
    }
  }, []);

  return (
    <div
      className="container flex items-center gap-2 px-2 md:px-3"
      style={{ width: `${containerWidth}px` }}
    >
      <FilterVideosModal />

      <div className="relative flex grow items-center overflow-hidden">
        {showLeftScroll && (
          <Button
            variant="ghost"
            size="icon"
            className="from-background absolute top-0 bottom-0 left-0 z-10 flex w-8 items-center rounded-lg bg-linear-to-r to-transparent backdrop-blur-xs"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
        )}

        {showRightScroll && (
          <Button
            variant="ghost"
            size="icon"
            className="from-background absolute top-0 right-0 bottom-0 z-10 flex items-center rounded-lg bg-linear-to-r to-transparent backdrop-blur-xs"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        )}
        <div
          ref={scrollContainerRef}
          className={cn(
            "flex gap-3 items-center overflow-x-auto scrollbar-hide grow"
          )}
        >
          <Badge
            onClick={handleOnClear}
            className="h-8 cursor-pointer p-0 px-3 text-sm font-normal tracking-normal text-nowrap select-none"
            variant={!channelId ? "default" : "outline"}
          >
            All
          </Badge>
          {activeChannels.map((channel) => (
            <Badge
              key={channel.id}
              variant={channel.id === channelId ? "default" : "outline"}
              onClick={() => handleSelectionChange(channel.id)}
              className="h-8 cursor-pointer p-0 px-3 text-sm font-normal tracking-normal text-nowrap select-none"
            >
              {channel.title}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CurrentActive({
  activeChannels,
}: {
  activeChannels: ChannelTag[];
}) {
  const searchParams = useSearchParams();

  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const channelId = params.get("channelId");
  const [activeFilteredChannel, setActiveFilteredChannel] = useState<
    ChannelTag | undefined | null
  >();

  useEffect(() => {
    if (channelId) {
      const filterChannel = activeChannels.find(
        (channel) => channel.id === channelId
      );

      setActiveFilteredChannel(filterChannel);
    } else {
      setActiveFilteredChannel(null);
    }
  }, [activeChannels, channelId]);

  if (activeFilteredChannel) {
    return (
      <div className="flex items-start gap-2 px-2 md:px-3">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage
            src={activeFilteredChannel.logo}
            alt={activeFilteredChannel.title}
          />
          <AvatarFallback>{activeFilteredChannel.title}</AvatarFallback>
        </Avatar>
        <h4 className="text-lg leading-none tracking-wide md:text-2xl">
          {activeFilteredChannel.title}
        </h4>
      </div>
    );
  }

  return null;
}

function FilterVideosModal() {
  const [duration, setDuration] = useQueryState(
    "duration",
    parseAsString.withDefault("").withOptions({
      history: "replace",
      shallow: false,
    })
  );

  function _onValueChange(value: string) {
    setDuration(value);
  }

  function _clearAll() {
    setDuration(null);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex h-8 cursor-pointer items-center gap-1 rounded-lg p-0 px-3 text-sm"
        >
          <SlidersHorizontal className="size-6" />
          <span>Filters</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader title="Filter videos">
          <DialogTitle>Filter videos</DialogTitle>
          <DialogDescription>Fine-tune your feed</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <Label htmlFor="video-duration" className="text-primary text-base">
              Duration
            </Label>
            <ToggleGroup
              id="video-duration"
              value={duration ?? ""}
              type="single"
              onValueChange={_onValueChange}
            >
              <ToggleGroupItem value="short" aria-label="Under 4 minutes">
                Short
              </ToggleGroupItem>
              <ToggleGroupItem
                value="medium"
                aria-label="Between 4 and 20 minutes"
              >
                Medium
              </ToggleGroupItem>
              <ToggleGroupItem value="long" aria-label="Over 20 minutes">
                Long
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <DialogFooter className="flex flex-1">
          <Button className="self-end" onClick={_clearAll} variant="outline">
            Clear all
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}