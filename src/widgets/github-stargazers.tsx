"use client";

import { StarIcon } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

import { Skeleton } from "~/shared/ui/skeleton";
import { cn } from "~/shared/utils/tailwind-merge";

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
      refreshInterval: 10 * 60 * 1000,
      revalidateOnFocus: false, // 10 minutes
    }
  );

  return (
    <div className="flex gap-2 items-center">
      {isLoading ? (
        <Skeleton className="w-7" />
      ) : (
        <Link
          tabIndex={0}
          prefetch={false}
          href={`https://github.com/${owner}/${repo}`}
          target="_blank"
        >
          <button
            tabIndex={-1}
            type="button"
            className={cn(
              "flex items-center gap-1 text-sm transition-colors duration-200 group/star",
              className
            )}
            aria-label={`Star ${owner}/${repo} on GitHub`}
          >
            <StarIcon
              tabIndex={-1}
              className="w-4 h-4 text-yellow-400 group-hover/star:fill-yellow-400"
            />
            <span className="tracking-wide">
              {data?.stargazers_count.toLocaleString()}
            </span>
          </button>
        </Link>
      )}
    </div>
  );
}
