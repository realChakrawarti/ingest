"use client";

import { ChevronDown, VideoIcon } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui/popover";
import { Separator } from "~/shared/ui/separator";

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
        <ChevronDown aria-label="Show archive details" className="size-4" />
      </PopoverTrigger>
      <PopoverContent className="min-w-96 px-0 py-3 border border-slate-600">
        <div className="flex flex-col gap-2">
          <p className="text-md px-3">{description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex gap-1 items-center px-3">
              <VideoIcon className="size-4" />
              Total Videos:{" "}
              <span className="text-primary/80">{totalVideos}</span>
            </div>
          </div>
          <Separator
            className="bg-slate-600 h-[1px] w-full"
            orientation="vertical"
          />
          <p className="text-sm px-3">
            Last updated on {new Date(updatedAt).toLocaleDateString()}.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
