import { VideoIcon } from "lucide-react";

type ArchiveInformationProps = {
  description: string;
  totalVideos: number;
  title: string;
};

export default function ArchiveInformation({
  description,
  totalVideos,
  title,
}: ArchiveInformationProps) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg tracking-wide lg:text-xl">{title}</h1>
      <p className="text-md">{description}</p>
      <div className="flex items-end gap-2 text-sm">
        <div className="text-muted-foreground flex items-center gap-1">
          <VideoIcon className="size-4" />
          <span>
            {totalVideos} {totalVideos > 1 ? "videos" : "video"}
          </span>
        </div>
      </div>
    </div>
  );
}