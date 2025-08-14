"use client";

import { ChevronDown, EyeIcon, File, VideoIcon } from "lucide-react";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui/popover";
import { Separator } from "~/shared/ui/separator";
import { getTimeDifference } from "~/shared/utils/time-diff";

type CatalogInformationPopoverProps = {
  description: string;
  pageviews: number;
  totalVideos: number;
  totalPosts: number;
  nextUpdate: string;
};

export default function CatalogInformationPopover({
  description,
  pageviews,
  totalVideos,
  totalPosts,
  nextUpdate,
}: CatalogInformationPopoverProps) {
  const [[when, diffUpdate], setTime] = useState(() =>
    getTimeDifference(nextUpdate)
  );

  const [open, setOpen] = useState(false);

  const handlePopoverOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setTime(getTimeDifference(nextUpdate));
    }
  };

  return (
    <Popover open={open} onOpenChange={handlePopoverOpen}>
      <PopoverTrigger asChild>
        <ChevronDown
          aria-label="Show catalog details"
          className="size-4 cursor-pointer"
        />
      </PopoverTrigger>
      <PopoverContent className="min-w-96 py-3 px-0 border border-slate-600">
        <div className="flex flex-col gap-3">
          <p className="text-md px-3">{description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm px-3">
            <div className="flex gap-1 items-center">
              <EyeIcon className="size-4" />
              Unique views: <span className="text-primary/80">{pageviews}</span>
            </div>
            <div className="flex gap-1 items-center">
              <VideoIcon className="size-4" />
              Total Videos:{" "}
              <span className="text-primary/80">{totalVideos}</span>
            </div>
            <div className="flex gap-1 items-center">
              <File className="size-4" />
              Total Posts: <span className="text-primary/80">{totalPosts}</span>
            </div>
          </div>
          <Separator
            className="bg-slate-600 h-[1px] w-full"
            orientation="vertical"
          />
          <div className="text-sm px-3">
            {when > 0 ? (
              <p>Next update: {diffUpdate}</p>
            ) : (
              <p>Please refresh the catalog for updated feed.</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
