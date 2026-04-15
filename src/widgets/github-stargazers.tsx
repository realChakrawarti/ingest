"use client";

import { StarIcon } from "lucide-react";

import useSWR from "swr";

import { Skeleton } from "~/shared/ui/skeleton";
import { cn } from "~/shared/utils/tailwind-merge";

import { OutLink } from "./out-link";

interface StargazerProps {
  owner: string;
  repo: string;
  className?: string;
}

export function GitHubStargazer({
  owner,
  repo,
  className = "",
}: StargazerProps) {
  const { data, isLoading } = useSWR(
    `https://api.github.com/repos/${owner}/${repo}`,
    (url) => fetch(url).then((res) => res.json()),
    {
      refreshInterval: 10 * 60 * 1000, // 10 minutes
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return (
    <div className="flex items-center gap-2">
      {isLoading ? (
        <Skeleton className="w-7" />
      ) : (
        <OutLink
          className={cn(
            "flex items-center gap-1 text-sm transition-colors duration-200 group/star",
            className
          )}
          tabIndex={0}
          href={`https://github.com/${owner}/${repo}`}
          target="_blank"
          aria-label={`Star ${owner}/${repo} on GitHub`}
        >
          <StarIcon
            tabIndex={-1}
            className="h-4 w-4 text-yellow-400 group-hover/star:fill-yellow-400"
            aria-hidden="true"
          />
          {data?.stargazers_count ? (
            <span className="text-foreground tracking-wide">
              {data?.stargazers_count}
            </span>
          ) : null}
        </OutLink>
      )}
    </div>
  );
}