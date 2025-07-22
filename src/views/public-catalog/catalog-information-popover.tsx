"use client";

import { ChevronDown, EyeIcon, File, VideoIcon } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui/popover";
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
  const [when, diffUpdate] = getTimeDifference(nextUpdate);

  return (
    <Popover>
      <PopoverTrigger>
        <ChevronDown className="size-4" />
        <PopoverContent className="min-w-96">
          <div className="flex flex-col gap-2">
            <p className="text-md">{description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex gap-1 items-center">
                <EyeIcon className="size-4" />
                Unique views:{" "}
                <span className="text-primary/80">{pageviews}</span>
              </div>
              <div className="flex gap-1 items-center">
                <VideoIcon className="size-4" />
                Total Videos:{" "}
                <span className="text-primary/80">{totalVideos}</span>
              </div>
              <div className="flex gap-1 items-center">
                <File className="size-4" />
                Total Posts:{" "}
                <span className="text-primary/80">{totalPosts}</span>
              </div>
            </div>
            <div className="text-sm">
              {when > 0 ? (
                <p>Next update: {diffUpdate}</p>
              ) : (
                <p>Please refresh the catalog for updated feed.</p>
              )}
            </div>
          </div>
        </PopoverContent>
      </PopoverTrigger>
    </Popover>
  );
}
