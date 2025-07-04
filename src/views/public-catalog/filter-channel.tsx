"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";
import { Badge } from "~/shared/ui/badge";
import { cn } from "~/shared/utils/tailwind-merge";

import type { ChannelTag } from "./helper-methods";

export default function FilterChannel({
  activeChannels,
}: {
  activeChannels: ChannelTag[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const channelId = params.get("channelId");

  const [selectedChannelId, setSelectedChannelId] = useState<string>("");

  const handleSelectionChange = (key: string) => {
    if (!key) {
      setSelectedChannelId(key);
      return;
    }

    setSelectedChannelId(key);

    if (key) {
      params.set("channelId", key);
    } else {
      params.delete("channelId");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const handleOnClear = () => {
    params.delete("channelId");

    replace(`${pathname}?${params.toString()}`);

    setSelectedChannelId("");
  };

  useEffect(() => {
    if (channelId) {
      setSelectedChannelId(channelId);
    }
  }, [channelId]);

  return (
    <div className="h-14 overflow-hidden">
      <div
        className={cn(
          // TODO: Handle the width change of the content wrt the sidebar and window resize, this is hacky!
          "px-3 flex gap-3 items-center overflow-x-auto scrollbar-hide",
          "max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
        )}
      >
        <Badge
          onClick={handleOnClear}
          className="cursor-pointer text-sm h-8 p-0 px-3 text-nowrap select-none"
          variant={!channelId ? "default" : "outline"}
        >
          All
        </Badge>
        {activeChannels.map((channel: any) => (
          <Badge
            key={channel.id}
            variant={channel.id === selectedChannelId ? "default" : "outline"}
            onClick={() => handleSelectionChange(channel.id)}
            className="cursor-pointer text-sm h-8 p-0 px-3 text-nowrap select-none"
          >
            {channel.title}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function CurrentActive({ activeChannels }: { activeChannels: any }) {
  const searchParams = useSearchParams();

  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const channelId = params.get("channelId");
  const [activeFilteredChannel, setActiveFilteredChannel] = useState<any>(null);

  useEffect(() => {
    if (channelId) {
      const filterChannel = activeChannels.find(
        (channel: any) => channel.id === channelId
      );

      setActiveFilteredChannel(filterChannel);
    } else {
      setActiveFilteredChannel(null);
    }
  }, [activeChannels, channelId]);

  if (activeFilteredChannel) {
    return (
      <div className="flex gap-2 items-center px-2 md:px-3">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage
            src={activeFilteredChannel.logo}
            alt={activeFilteredChannel.title}
          />
          <AvatarFallback>{activeFilteredChannel.title}</AvatarFallback>
        </Avatar>
        <h4 className="text-2xl font-bold">{activeFilteredChannel.title}</h4>
      </div>
    );
  }

  return <></>;
}
