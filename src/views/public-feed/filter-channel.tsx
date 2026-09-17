"use client";

import type { ChannelTag } from "./helper-methods";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { parseAsString, useQueryState } from "nuqs";

import useScreenWidth from "~/shared/hooks/use-screen-width";
import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";
import { Button } from "~/shared/ui/button";
import { ToggleGroup, ToggleGroupItem } from "~/shared/ui/toggle-group";

import BadgeScroll from "~/widgets/badge-scroll";
import JustTip from "~/widgets/just-the-tip";
export default function FilterChannel({
  activeChannels,
}: {
  activeChannels: ChannelTag[];
}) {
  const containerWidth = useScreenWidth();
  const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      <div
        className="container flex items-center gap-2 px-2 md:px-3"
        style={{ width: `${containerWidth}px` }}
      >
        <Button
          onClick={() => setShowFilter((state) => !state)}
          variant="outline"
          className="flex h-8 cursor-pointer items-center gap-1 rounded-lg p-0 px-3 text-sm"
        >
          <SlidersHorizontal className="size-4" />
          <span>{showFilter ? "Hide" : "Show"} Filters</span>
        </Button>

        <BadgeScroll
          queryParam="channelId"
          values={activeChannels.map((channel) => ({
            id: channel.id,
            label: channel.title,
          }))}
        />
      </div>
      {showFilter ? (
        <div className="h-auto border border-t-2 border-b-2 p-3">
          <FilterVideosPanel />
        </div>
      ) : null}
    </>
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

function FilterVideosPanel() {
  const [duration, setDuration] = useQueryState(
    "duration",
    parseAsString.withDefault("").withOptions({
      history: "replace",
      shallow: false,
    })
  );

  const [watched, setWatched] = useQueryState(
    "watched",
    parseAsString.withDefault("").withOptions({
      history: "replace",
      shallow: false,
    })
  );

  function onDurationChange(value: string) {
    setDuration(value);
  }

  function onWatchedChange(value: string) {
    setWatched(value);
  }

  function clearAll() {
    setDuration(null);
    setWatched(null);
  }

  return (
    <div className="flex flex-col items-start gap-3">
      {/*Watched*/}
      <div className="flex items-center gap-3">
        <ToggleGroup
          id="video-duration"
          value={watched ?? ""}
          type="single"
          onValueChange={onWatchedChange}
        >
          <ToggleGroupItem value="all" aria-label="All videos">
            <JustTip label="Watched videos">
              <p>All videos</p>
            </JustTip>
          </ToggleGroupItem>
          <ToggleGroupItem value="incomplete" aria-label="Unwatched videos">
            <JustTip label="Unwatched videos">
              <p>Unwatched videos</p>
            </JustTip>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {/*Duration*/}
      <div className="flex items-center gap-3">
        <ToggleGroup
          id="video-duration"
          value={duration ?? ""}
          type="single"
          onValueChange={onDurationChange}
        >
          <ToggleGroupItem value="short" aria-label="Under 4 minutes">
            <JustTip label="Under 4 minutes">
              <p>Short videos</p>
            </JustTip>
          </ToggleGroupItem>
          <ToggleGroupItem value="medium" aria-label="Between 4 and 20 minutes">
            <JustTip label="Between 4 and 20 minutes">
              <p>Medium videos</p>
            </JustTip>
          </ToggleGroupItem>
          <ToggleGroupItem value="long" aria-label="Over 20 minutes">
            <JustTip label="Over 20 minutes">
              <p>Long videos</p>
            </JustTip>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Button onClick={clearAll} variant="outline">
        Clear all
      </Button>
    </div>
  );
}
