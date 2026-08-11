import { EyeIcon } from "lucide-react";
import { Separator } from "~/shared/ui/separator";

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
    <h1 className="flex items-center gap-2 text-lg tracking-wide lg:text-xl">
      <p>{title}</p>
      <Separator orientation="vertical" className="bg-primary/40 h-4 w-2" />
      <div className="text-muted-foreground flex items-end gap-2 text-sm">
        <div className="flex items-center gap-1">
          <EyeIcon className="size-4" />
          <span>{totalVideos} views</span>
        </div>
      </div>
    </h1>
    <p className="text-md">{description}</p>
  </div>
  );
}
