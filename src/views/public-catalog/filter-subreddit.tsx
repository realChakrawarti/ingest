"use client";

import useScreenWidth from "~/shared/hooks/use-screen-width";

import BadgeScroll from "~/widgets/badge-scroll";

export function FilterSubreddit({ subreddits }: { subreddits: string[] }) {
  const containerWidth = useScreenWidth();

  return (
    <div
      className="container flex items-center gap-2 px-2 md:px-3"
      style={{ width: `${containerWidth}px` }}
    >
      <BadgeScroll
        queryParam="subreddit"
        values={subreddits.map((subreddit) => ({
          id: subreddit,
          label: `r/${subreddit}`,
        }))}
      />
    </div>
  );
}