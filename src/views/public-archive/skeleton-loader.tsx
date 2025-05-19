import { Skeleton } from "~/shared/ui/skeleton";
import GridContainer from "~/widgets/grid-container";

export function ArchiveLoadingSkeleton() {
  return (
    <div className="space-y-4 pb-6 pt-7">
      <section className="px-2 md:px-3">
        <div className="space-y-1">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 sm:w-96 w-64" />
        </div>
      </section>
      <section className="px-0 md:px-3">
        {Array.from(Array(4).keys()).map((index) => (
          <GridContainer key={`section-${index}`}>
            {Array.from(Array(4).keys()).map((index) => (
              <YouTubeSkeletonCard key={`card-${index}`} />
            ))}
          </GridContainer>
        ))}
      </section>
    </div>
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
