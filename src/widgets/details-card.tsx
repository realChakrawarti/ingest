import { EyeIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

import { ValidMetadata } from "~/shared/types-schema/types";

import ThumbnailCarousel from "./carousel-thumbnails";
import JustTip from "./just-the-tip";
import OverlayTip from "./overlay-tip";

interface DetailsCardProps {
  pageData: ValidMetadata;
  path: string;
}

export default function DetailsCard({ pageData, path }: DetailsCardProps) {
  return (
    <Link
      prefetch={false} // In order to disable automatic updation to not frequently viewed catalogs
      key={pageData?.id}
      href={path}
      className="group relative overflow-hidden rounded-lg border bg-card transition-colors hover:bg-accent"
    >
      <section className="aspect-video">
        <ThumbnailCarousel thumbnails={pageData.thumbnails} />
      </section>
      {pageData?.pageviews ? <Pageview pageviews={pageData.pageviews} /> : null}
      {pageData?.totalVideos ? (
        <TotalVideos totalVideos={pageData.totalVideos} />
      ) : null}
      <div className="p-4">
        <h2 className="font-semibold group-hover:text-primary">
          {pageData?.title}
        </h2>
        <p className="text-sm text-muted-foreground">{pageData?.description}</p>
      </div>
    </Link>
  );
}

function TotalVideos({ totalVideos }: { totalVideos: number }) {
  return (
    <JustTip label="Total videos">
      <OverlayTip
        id="total-videos"
        className="flex gap-1 absolute top-2 left-0 items-center px-[5px] py-2 rounded-r-md z-20"
      >
        <p className="text-xs">{totalVideos}</p>
        <VideoIcon className="size-3" />
      </OverlayTip>
    </JustTip>
  );
}

function Pageview({ pageviews }: { pageviews: number }) {
  if (pageviews !== undefined) {
    return (
      <JustTip label="Unique views">
        <OverlayTip
          id="pageviews"
          className="flex gap-1 px-[5px] py-2 absolute top-2 right-0 items-center rounded-l-md z-20"
        >
          <p className="text-xs">{pageviews}</p>
          <EyeIcon className="size-3" />
        </OverlayTip>
      </JustTip>
    );
  }
  return null;
}
