import { Skeleton } from "~/shared/ui/skeleton";

import { ItemSection } from "~/widgets/item-section";

export function ArchiveLoadingSkeleton() {
  return (
    <div className="space-y-4 pt-7 pb-6">
      <section className="space-y-4 px-2 md:px-3">
        <Skeleton className="bg-primary/10 size-full min-h-45 w-full rounded-md" />
        <Skeleton className="h-6 w-48" />
      </section>
      {Array.from(Array(4).keys()).map((index) => (
        <ItemSection key={`section-${index}`}>
          {Array.from(Array(4).keys()).map((index) => (
            <YouTubeSkeletonCard key={`card-${index}`} />
          ))}
        </ItemSection>
      ))}
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