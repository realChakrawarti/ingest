import { EyeIcon, File, VideoIcon } from "lucide-react";

type CatalogInformationProps = {
  title: string;
  description: string;
  pageviews: number;
  totalVideos: number;
  totalPosts: number;
};

export default function CatalogInformation({
  title,
  description,
  pageviews,
  totalVideos,
  totalPosts,
}: CatalogInformationProps) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg tracking-wide lg:text-xl">{title}</h1>
      <p className="text-md">{description}</p>
      <div className="text-muted-foreground flex items-end gap-2 text-sm">
        <div className="flex items-center gap-1">
          <EyeIcon className="size-4" />
          <span>{pageviews} views</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <VideoIcon className="size-4" />
          <span>{totalVideos} videos</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <File className="size-4" />
          <span>{totalPosts} posts</span>
        </div>
      </div>
    </div>
  );
}