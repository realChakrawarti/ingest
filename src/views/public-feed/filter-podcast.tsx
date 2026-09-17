"use client";

import useScreenWidth from "~/shared/hooks/use-screen-width";

import BadgeScroll from "~/widgets/badge-scroll";

export function FilterPodcast({
  podcasts,
}: {
  podcasts: { key: string; value: string }[];
}) {
  const containerWidth = useScreenWidth();

  return (
    <div
      className="container flex items-center gap-2 px-2 md:px-3"
      style={{ width: `${containerWidth}px` }}
    >
      <BadgeScroll
        queryParam="podcast"
        values={podcasts.map((podcast) => ({
          id: podcast.key,
          label: podcast.value,
        }))}
      />
    </div>
  );
}