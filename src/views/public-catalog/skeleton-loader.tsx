import { Skeleton } from "~/shared/ui/skeleton";

import GridContainer from "~/widgets/grid-container";
export default function CatalogLoadingSkeleton() {
  return (
    <div className="space-y-4 pb-6 pt-7">
      <section className="px-2 md:px-3">
        <div className="space-y-0">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Skeleton className="size-6" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="size-6" />
            </div>
            <div>
              <Skeleton className="size-6" />
            </div>
          </div>
        </div>
      </section>
      <SubredditSection />
      <FilterSection />
      <VideoSection>
        {Array.from(Array(4).keys()).map((index) => (
          <YouTubeSkeletonCard key={index} />
        ))}
      </VideoSection>
      <VideoSection>
        {Array.from(Array(4).keys()).map((index) => (
          <YouTubeSkeletonCard key={index} />
        ))}
      </VideoSection>
      <VideoSection>
        {Array.from(Array(4).keys()).map((index) => (
          <YouTubeSkeletonCard key={index} />
        ))}
      </VideoSection>
    </div>
  );
}

function FilterSection() {
  return (
    <section className="px-0 md:px-3 space-y-4">
      <div className="px-2 md:px-0 flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton className="h-6 w-20" key={i} />
        ))}
      </div>
    </section>
  );
}

function SubredditSection() {
  return (
    <section className="px-0 md:px-3 space-y-4">
      <div className="px-2 md:px-0 flex items-center gap-2">
        <Skeleton className="h-6 w-1 rounded-md" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 min-w-36" />
      </div>
      <Skeleton className="min-h-44 w-full" />
    </section>
  );
}
function VideoSection({ children }: any) {
  return (
    <section className="px-0 md:px-3 space-y-4">
      <div className="px-2 md:px-0 flex items-center gap-2">
        <Skeleton className="h-6 w-1 rounded-md" />
        <Skeleton className="h-6 w-32" />
      </div>
      <GridContainer>{children}</GridContainer>
    </section>
  );
}
function YouTubeSkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-lg">
        <Skeleton className="relative aspect-video overflow-hidden" />
        <div className="p-3">
          <div className="flex gap-3">
            <Skeleton className="size-9 rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-[60%] pr-6" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
