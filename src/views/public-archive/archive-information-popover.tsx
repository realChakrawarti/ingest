"use client";

import { ChevronDown, VideoIcon } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui/popover";

type ArchiveInformationPopoverProps = {
  description: string;
  totalVideos: number;
  updatedAt: string;
};

export default function ArchiveInformationPopover({
  description,
  totalVideos,
  updatedAt,
}: ArchiveInformationPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <ChevronDown className="size-4" />
        <PopoverContent className="min-w-96">
          <div className="flex flex-col gap-2">
            <p className="text-md">{description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex gap-1 items-center">
                <VideoIcon className="size-4" />
                Total Videos:{" "}
                <span className="text-primary/80">{totalVideos}</span>
              </div>
            </div>
            <p className="text-sm">
              Last updated on {new Date(updatedAt).toLocaleDateString()}.
            </p>
          </div>
        </PopoverContent>
      </PopoverTrigger>
    </Popover>
  );
}
