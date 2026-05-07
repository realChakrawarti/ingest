"use client";

import type { ChannelTag } from "./helper-methods";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { parseAsString, useQueryState } from "nuqs";

import useScreenWidth from "~/shared/hooks/use-screen-width";
import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";
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

import BadgeScroll from "~/widgets/badge-scroll";
export default function FilterChannel({
  activeChannels,
}: {
  activeChannels: ChannelTag[];
}) {
  const containerWidth = useScreenWidth();

  return (
    <div
      className="container flex items-center gap-2 px-2 md:px-3"
      style={{ width: `${containerWidth}px` }}
    >
      <FilterVideosModal />

      <BadgeScroll
        queryParam="channelId"
        values={activeChannels.map((channel) => ({
          id: channel.id,
          label: channel.title,
        }))}
      />
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
